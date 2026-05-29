const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post('/', async (req, res) => {

    console.log("HEADERS =", req.headers);
    console.log("BODY =", req.body);

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Request body missing"
        });
    }

    if (req.body.confirmPassword !== undefined) {
        authController.signup(req, res);
    } else {
        authController.login(req, res);
    }
});

module.exports = router;