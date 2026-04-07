const express = require('express');
const router = express.Router();
const db = require('../models');
const WorkflowService = require('../services/WorkflowService');
const RuleEngine = require('../services/RuleEngine');
const ApprovalService = require('../services/ApprovalService');

// POST /pr
router.post('/', async (req, res) => {
    try {
        const { pr_number, customer_name, product_name, quantity, unit_price, total_price, created_by } = req.body;
        
        // 1. Fetch user to send to RuleEngine
        const user = await db.users.findByPk(created_by, {
            include: [{ model: db.roles, as: 'role' }]
        });
        if (!user) return res.status(404).json({ error: "Creator user not found" });

        // 2. Wrap creation in transaction
        const result = await db.sequelize.transaction(async (t) => {
            // Create PR initially PENDING
            const newPR = await db.purchase_requests.create({
                pr_number, customer_name, product_name, quantity, unit_price, total_price, created_by, status: 'PENDING'
            }, { transaction: t });

            // 3. Fetch workflow for PR CREATE
            let workflow;
            try {
                workflow = await WorkflowService.getWorkflow('PR', 'CREATE');
            } catch (err) {
                // No workflow found
                return newPR;
            }

            // 4. Evaluate Rules dynamically
            const matchingRule = RuleEngine.evaluate(workflow.rules, user);

            if (!matchingRule) {
                return newPR; // No rule match -> stays pending or up to logic
            }

            if (!matchingRule.approval_required) {
                newPR.status = 'CLOSED';
                await newPR.save({ transaction: t });
                return newPR;
            }

            // Case B: Approval Required
            await ApprovalService.createApprovalRequest(
                'PR',
                newPR.id,
                workflow.id,
                matchingRule.levels,
                user.id
            );

            return newPR;
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET /pr/list
router.get('/list', async (req, res) => {
    try {
        const prs = await db.purchase_requests.findAll({
            include: [{ model: db.users, as: 'creator' }],
            order: [['created_at', 'DESC']]
        });
        res.json(prs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
