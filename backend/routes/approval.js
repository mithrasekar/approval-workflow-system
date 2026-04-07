const express = require('express');
const router = express.Router();
const db = require('../models');
const ApprovalService = require('../services/ApprovalService');

// GET /approval/pending?user_id=101
router.get('/pending', async (req, res) => {
    try {
        const userId = req.query.user_id;
        if (!userId) return res.status(400).json({ error: "user_id is required" });

        const pendingSteps = await db.approval_request_steps.findAll({
            where: {
                approver_user_id: userId,
                status: 'PENDING'
            },
            include: [{
                model: db.approval_requests,
                as: 'request',
                where: { status: 'PENDING' },
                include: [{
                    model: db.users, // Include request creator
                    as: 'creator'
                }]
            }]
        });

        // For richer UI, fetch entity data (like PR) via raw query or fetching dynamically based on entity_type
        // But since we know it's PR, let's inject it.
        const augmentedResponse = await Promise.all(pendingSteps.map(async step => {
            const stepData = step.toJSON();
            if (stepData.request.entity_type === 'PR') {
                const pr = await db.purchase_requests.findByPk(stepData.request.entity_id);
                stepData.request.entity_payload = pr;
            }
            return stepData;
        }));

        res.json(augmentedResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /approval/:request_id/approve
router.post('/:request_id/approve', async (req, res) => {
    try {
        const { user_id, remarks } = req.body;
        const requestId = req.params.request_id;
        if (!user_id) return res.status(400).json({ error: "user_id is required" });

        const request = await ApprovalService.actionRequest(requestId, user_id, 'APPROVED', remarks);
        
        res.json({ message: "Approved successfully", request });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// POST /approval/:request_id/reject
router.post('/:request_id/reject', async (req, res) => {
    try {
        const { user_id, remarks } = req.body;
        const requestId = req.params.request_id;
        if (!user_id) return res.status(400).json({ error: "user_id is required" });

        const request = await ApprovalService.actionRequest(requestId, user_id, 'REJECTED', remarks);
        
        res.json({ message: "Rejected successfully", request });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
