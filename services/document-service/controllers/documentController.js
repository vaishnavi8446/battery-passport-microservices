const { v4: uuidv4 } = require('uuid');
const Document = require('../models/Document');
const { uploadFile, deleteFile, generatePresignedUrl, fileExists } = require('../utils/s3');
const logger = require('../../shared/utils/logger');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a file'
      });
    }

    const userId = req.user.id;
    const file = req.file;
    const docId = uuidv4();
    const s3Key = `documents/${docId}/${file.originalname}`;

    // Upload file to S3
    await uploadFile(file, s3Key);

    // Save document metadata to MongoDB
    const document = new Document({
      docId,
      fileName: file.originalname,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      s3Key,
      s3Bucket: process.env.S3_BUCKET_NAME,
      uploadedBy: userId
    });

    await document.save();

    logger.info(`Document uploaded: ${docId} by user ${userId}`);

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: document.toPublicJSON()
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Unable to upload document'
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { docId } = req.params;

    const document = await Document.findOne({ docId, isActive: true })
      .populate('uploadedBy', 'email');

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist or has been deleted'
      });
    }

    // Check if file exists in S3
    const exists = await fileExists(document.s3Key);
    if (!exists) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File does not exist in storage'
      });
    }

    // Generate presigned URL for download
    const downloadUrl = await generatePresignedUrl(document.s3Key);

    res.json({
      document: document.toPublicJSON(),
      downloadUrl
    });
  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({
      error: 'Retrieval failed',
      message: 'Unable to retrieve document'
    });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const { fileName } = req.body;
    const userId = req.user.id;

    if (!fileName) {
      return res.status(400).json({
        error: 'File name required',
        message: 'Please provide a file name'
      });
    }

    const document = await Document.findOne({ docId, isActive: true });

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist or has been deleted'
      });
    }

    // Update document metadata
    document.fileName = fileName;
    await document.save();

    logger.info(`Document updated: ${docId} by user ${userId}`);

    res.json({
      message: 'Document updated successfully',
      document: document.toPublicJSON()
    });
  } catch (error) {
    logger.error('Update document error:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'Unable to update document'
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const userId = req.user.id;

    const document = await Document.findOne({ docId, isActive: true });

    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist or has already been deleted'
      });
    }

    // Delete file from S3
    await deleteFile(document.s3Key);

    // Soft delete document metadata
    document.isActive = false;
    await document.save();

    logger.info(`Document deleted: ${docId} by user ${userId}`);

    res.json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Delete document error:', error);
    res.status(500).json({
      error: 'Deletion failed',
      message: 'Unable to delete document'
    });
  }
};

const listDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const documents = await Document.find({ 
      uploadedBy: userId, 
      isActive: true 
    })
      .populate('uploadedBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments({ 
      uploadedBy: userId, 
      isActive: true 
    });

    res.json({
      documents: documents.map(doc => doc.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('List documents error:', error);
    res.status(500).json({
      error: 'Retrieval failed',
      message: 'Unable to retrieve documents'
    });
  }
};

module.exports = {
  uploadDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  listDocuments
}; 