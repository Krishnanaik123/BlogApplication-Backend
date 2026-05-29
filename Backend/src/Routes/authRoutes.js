const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post('/', async (req, res) => {
    if (req.body.confirmPassword !== undefined) {
        authController.signup(req, res);

     console.log("LOGIN REQUEST:", username, password);


    } else {
        authController.login(req, res);
    }
});

module.exports = router;