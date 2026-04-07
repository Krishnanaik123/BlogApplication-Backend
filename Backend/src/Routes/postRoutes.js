const express = require('express');
const router = express.Router();

const postController = require('../Controllers/postController');
const upload = require('../middlewares/upload.middleware'); 

router.post('/', upload.any(), postController.createPost); 

module.exports = router;