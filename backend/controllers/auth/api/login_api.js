const express = require('express');
const router = express.Router();
const LoginQuery = require('../query/LoginQuery');

router.post('/login', async (req, res) => {
    try {
        const query = new LoginQuery(req.body);
        const user = await query.execute();
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;
