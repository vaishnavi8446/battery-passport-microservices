const AWS = require('aws-sdk');
const logger = require('../../shared/utils/logger');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const bucketName = process.env.S3_BUCKET_NAME;

const uploadFile = async (file, key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private'
    };

    const result = await s3.upload(params).promise();
    logger.info(`File uploaded to S3: ${key}`);
    return result;
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    await s3.deleteObject(params).promise();
    logger.info(`File deleted from S3: ${key}`);
  } catch (error) {
    logger.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

const generatePresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    logger.info(`Presigned URL generated for: ${key}`);
    return url;
  } catch (error) {
    logger.error('S3 presigned URL error:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

const fileExists = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  generatePresignedUrl,
  fileExists
}; 