const db = require('../../../models');
const ApprovalService = require('../../../services/ApprovalService');

module.exports = class GetPendingApprovalsQuery {
    constructor(userId) {
        this.userId = userId;
    }

    async get() {
        const userId = Number(this.userId);
        const pendingSteps = await db.approval_request_steps.findAll({
            where: { approver_user_id: userId, status: 'PENDING' },
            include: [{
                model: db.approval_requests, as: 'request', where: { status: 'PENDING' },
                include: [{ model: db.users, as: 'creator' }]
            }]
        });

        // 1. Fetch all unique request IDs already actioned by this user
        const actionedRequests = await db.approval_actions.findAll({
            where: { action_by: userId },
            attributes: ['approval_request_id'],
            raw: true
        });
        const actionedIds = new Set(actionedRequests.map(a => Number(a.approval_request_id)));

        const activePendingSteps = [];
        for (const step of pendingSteps) {
            const stepData = step.toJSON();
            
            // 2. Add to activePendingSteps ONLY if:
            //    - It matches the current level of the request
            //    - The user has NOT already performed an action on this entire request (no double-dipping)
            if (stepData.request.current_level === stepData.level_no && !actionedIds.has(Number(stepData.approval_request_id))) {
                activePendingSteps.push(step);
            }
        }

        return await Promise.all(activePendingSteps.map(async step => {
            const stepData = step.toJSON();
            if (stepData.request.entity_type === 'PR') {
                stepData.request.entity_payload = await db.purchase_requests.findByPk(stepData.request.entity_id);
            }
            return stepData;
        }));
    }
}