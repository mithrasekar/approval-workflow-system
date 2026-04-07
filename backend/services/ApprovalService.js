const db = require('../models');

class ApprovalService {
    /**
     * Resolves approver rules to actual user IDs.
     * E.g., if approver_type = 'ROLE', it finds users with that role.
     */
    static async resolveApprovers(level) {
        if (level.approver_type === 'USER' && level.approver_user_id) {
            return [level.approver_user_id];
        } else if (level.approver_type === 'ROLE' && level.approver_role_id) {
            const users = await db.users.findAll({
                where: { role_id: level.approver_role_id, is_active: true },
                attributes: ['id']
            });
            return users.map(u => u.id);
        }
        return [];
    }

    /**
     * Creates an approval request and its steps in a single transaction.
     */
    static async createApprovalRequest(entityType, entityId, workflowId, levels, creatorId, t = null) {
        const transaction = t || await db.sequelize.transaction();
        try {
            // 1. Create the base request
            const request = await db.approval_requests.create({
                entity_type: entityType,
                entity_id: entityId,
                action: 'CREATE',
                workflow_id: workflowId,
                current_level: 1, // Start at level 1
                status: 'PENDING',
                created_by: creatorId
            }, { transaction });

            // 2. Generate steps dynamically
            const stepsData = [];
            for (const level of levels) {
                const approverUserIds = await this.resolveApprovers(level);
                
                for (const approverId of approverUserIds) {
                    stepsData.push({
                        approval_request_id: request.id,
                        level_no: level.level_no,
                        approver_user_id: approverId,
                        status: 'PENDING'
                    });
                }
            }

            if (stepsData.length === 0) {
                throw new Error("No approvers could be resolved for this workflow.");
            }

            // Insert steps
            await db.approval_request_steps.bulkCreate(stepsData, { transaction });
            
            if (!t) await transaction.commit();
            return request;
        } catch (error) {
            if (!t && transaction) await transaction.rollback();
            throw error;
        }
    }

    /**
     * Action an approval step (Approve/Reject) using a Pessimistic DB transaction.
     */
    static async actionRequest(requestId, userId, actionType, remarks = '') {
        const transaction = await db.sequelize.transaction();
        try {
            // Lock the request row so no other user can process it concurrently
            const request = await db.approval_requests.findByPk(requestId, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!request) throw new Error("Approval Request not found");
            if (request.status !== 'PENDING') throw new Error(`Request is already ${request.status}`);

            const numericUserId = Number(userId);

            // Lock the step row for this user at this level
            const step = await db.approval_request_steps.findOne({
                where: {
                    approval_request_id: requestId,
                    level_no: request.current_level,
                    approver_user_id: numericUserId,
                    status: 'PENDING'
                },
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!step) {
                throw new Error("You are not authorized to action this request at the current level or step is already actioned.");
            }

            // Security check: Verify the user hasn't already actioned this request at a previous level
            const alreadyActioned = await db.approval_actions.findOne({
                where: {
                    approval_request_id: requestId,
                    action_by: numericUserId
                },
                transaction
            });
            if (alreadyActioned) {
                throw new Error("You have already performed an action on this request at a previous level.");
            }

            // Update step status
            step.status = actionType;
            step.action_at = new Date();
            await step.save({ transaction });

            // Create action record
            await db.approval_actions.create({
                approval_request_id: requestId,
                level_no: request.current_level,
                action: actionType,
                action_by: numericUserId,
                remarks: remarks
            }, { transaction });

            if (actionType === 'REJECTED') {
                request.status = 'REJECTED';
                await request.save({ transaction });
                await this.updateEntityStatus(request.entity_type, request.entity_id, 'REJECTED', transaction);
                await transaction.commit();
                return request;
            }

            if (actionType === 'APPROVED') {
                await db.approval_request_steps.update(
                    { status: 'SKIPPED' }, 
                    { 
                        where: { 
                            approval_request_id: requestId, 
                            level_no: request.current_level,
                            status: 'PENDING'
                        },
                        transaction 
                    }
                );

                const nextLevelStep = await db.approval_request_steps.findOne({
                    where: {
                        approval_request_id: requestId,
                        level_no: request.current_level + 1
                    },
                    transaction
                });

                if (nextLevelStep) {
                    request.current_level += 1;
                    await request.save({ transaction });
                    // As per new requirements, an intermediate approval sets the PR status to APPROVED
                    await this.updateEntityStatus(request.entity_type, request.entity_id, 'APPROVED', transaction);
                } else {
                    request.status = 'APPROVED';
                    await request.save({ transaction });
                    await this.updateEntityStatus(request.entity_type, request.entity_id, 'CLOSED', transaction);
                }
            }

            await transaction.commit();
            return request;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }

    static async updateEntityStatus(entityType, entityId, status, transaction) {
        if (entityType === 'PR') {
            await db.purchase_requests.update(
                { status: status },
                { where: { id: entityId }, transaction: transaction }
            );
        }
    }
}

module.exports = ApprovalService;
