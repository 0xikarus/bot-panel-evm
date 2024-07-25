import express from 'express';

const router = express.Router();

router.get('/status', async (req, res) => {
    res.json({
        success: true,
        address: req.user.address,
        role: req.user.role,
    });
});


// write ping post route
router.post('/ping', async (req, res) => {
    res.json({
        success: true,
        pong:true
    });
});

export default router;
