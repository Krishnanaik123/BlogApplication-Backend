const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const uploadsDir = 'uploads/';
const initializeUploadsDir = async () => {
    try {
        await fs.mkdir(uploadsDir, { recursive: true });
        console.log('Uploads directory is ready');
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
};

initializeUploadsDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

module.exports = upload;