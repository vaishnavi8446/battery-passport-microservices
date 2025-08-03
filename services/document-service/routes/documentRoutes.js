const express = require('express');
const multer = require('multer');
const { verifyWithAuthService } = require('../../shared/middleware/auth');
const documentController = require('../controllers/documentController');

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, Excel, text, and image files are allowed.'), false);
    }
  }
});

// All routes require authentication
router.use(verifyWithAuthService);

// Upload document
router.post('/upload', upload.single('file'), documentController.uploadDocument);

// List documents
router.get('/', documentController.listDocuments);

// Get document
router.get('/:docId', documentController.getDocument);

// Update document metadata
router.put('/:docId', documentController.updateDocument);

// Delete document
router.delete('/:docId', documentController.deleteDocument);

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: error.message
    });
  }

  next(error);
});

module.exports = router; 