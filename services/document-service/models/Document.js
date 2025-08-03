const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  s3Key: {
    type: String,
    required: true
  },
  s3Bucket: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
documentSchema.index({ docId: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ createdAt: 1 });

// Method to get public representation
documentSchema.methods.toPublicJSON = function() {
  const docObject = this.toObject();
  delete docObject.__v;
  delete docObject.s3Key;
  delete docObject.s3Bucket;
  return docObject;
};

module.exports = mongoose.model('Document', documentSchema); 