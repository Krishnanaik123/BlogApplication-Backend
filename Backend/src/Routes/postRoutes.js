const express = require('express');
const router = express.Router();

const postController = require('../Controllers/postController');
const upload = require('../middlewares/upload.middleware');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, upload.any(), postController.createPost); 

module.exports = router;