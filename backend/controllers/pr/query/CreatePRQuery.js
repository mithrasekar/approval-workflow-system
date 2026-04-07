const db = require('../../../models');
const WorkflowService = require('../../../services/WorkflowService');
const RuleEngine = require('../../../services/RuleEngine');
const ApprovalService = require('../../../services/ApprovalService');

module.exports = class CreatePRQuery {
    constructor(payload) {
        this.payload = payload;
    }

    async execute() {
        const { pr_number, customer_name, product_name, quantity, unit_price, total_price, created_by } = this.payload;

        const user = await db.users.findByPk(created_by, {
            include: [{ model: db.roles, as: 'role' }]
        });
        if (!user) throw new Error("Creator user not found");

        const transaction = await db.sequelize.transaction();
        try {
            const workflow = await WorkflowService.getWorkflow('PR', 'CREATE');
            
            // 1. Check global workflow approval requirement
            if (!workflow.approval_required) {
                const newPR = await db.purchase_requests.create({
                    pr_number, customer_name, product_name, quantity, unit_price, total_price, created_by, status: 'CLOSED'
                }, { transaction });
                await transaction.commit();
                return newPR;
            }

            // 2. Initial PENDING status for approval flows
            const newPR = await db.purchase_requests.create({
                pr_number, customer_name, product_name, quantity, unit_price, total_price, created_by, status: 'PENDING'
            }, { transaction });

            const matchingRule = RuleEngine.evaluate(workflow.rules, user);
            if (!matchingRule) {
                throw new Error("No matching rule: Your assigned role is not authorized in the Approval Matrix.");
            }

            // 3. Rule-based direct approval (e.g. for Manager)
            if (!matchingRule.approval_required) {
                newPR.status = 'CLOSED';
                await newPR.save({ transaction });
                await transaction.commit();
                return newPR;
            }

            // 4. Initiate Multi-level approval flow
            await ApprovalService.createApprovalRequest('PR', newPR.id, workflow.id, matchingRule.levels, user.id, transaction);

            await transaction.commit();
            return newPR;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }
}