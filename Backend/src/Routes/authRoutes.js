const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post('/', async (req, res) => {
    if (req.body.confirmPassword !== undefined) {
        authController.signup(req, res);
    } else {
        authController.login(req, res);
    }
});

module.exports = router;