const db = require('../models');

class WorkflowService {
    /**
     * Finds the applicable workflow for a given entity type and action.
     */
    static async getWorkflow(entityType, action) {
        const workflow = await db.approval_workflows.findOne({
            where: {
                entity_type: entityType,
                action: action,
                is_active: true
            },
            include: [{
                model: db.approval_workflow_rules,
                as: 'rules',
                include: [{
                    model: db.approval_levels,
                    as: 'levels',
                    include: [
                        { model: db.users, as: 'user', required: false },
                        { model: db.roles, as: 'role', required: false }
                    ]
                }]
            }]
        });

        if (!workflow) {
            throw new Error(`No active workflow found for entity ${entityType} and action ${action}`);
        }

        return workflow;
    }
}

module.exports = WorkflowService;
