const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../../../shared/utils/logger');

// Create transporter for email sending
const createTransporter = () => {
  // For development, use a mock transporter that writes to file
  if (process.env.NODE_ENV === 'development') {
    return {
      sendMail: async (mailOptions) => {
        const emailContent = `
From: ${mailOptions.from}
To: ${mailOptions.to}
Subject: ${mailOptions.subject}
Date: ${new Date().toISOString()}

${mailOptions.text || mailOptions.html}
        `;

        const fileName = `email_${Date.now()}.txt`;
        const filePath = path.join(__dirname, '../../../logs', fileName);
        
        try {
          await fs.writeFile(filePath, emailContent);
          logger.info(`Email saved to file: ${fileName}`);
          return { messageId: `mock_${Date.now()}` };
        } catch (error) {
          logger.error('Failed to save email to file:', error);
          throw error;
        }
      }
    };
  }

  // For production, use actual SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

const sendNotification = async (to, subject, content, type = 'text') => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@batterypassport.com',
      to,
      subject,
      ...(type === 'html' ? { html: content } : { text: content })
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}: ${result.messageId}`);
    return result;
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

const sendPassportCreatedNotification = async (data) => {
  const { batteryIdentifier, createdBy } = data;
  
  const subject = 'New Battery Passport Created';
  const content = `
A new battery passport has been created.

Battery Identifier: ${batteryIdentifier}
Created By: ${createdBy}
Created At: ${new Date().toISOString()}

This is an automated notification from the Battery Passport System.
  `;

  // In a real system, you would get the user's email from the database
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@batterypassport.com';
  
  await sendNotification(adminEmail, subject, content);
};

const sendPassportUpdatedNotification = async (data) => {
  const { batteryIdentifier, updatedBy } = data;
  
  const subject = 'Battery Passport Updated';
  const content = `
A battery passport has been updated.

Battery Identifier: ${batteryIdentifier}
Updated By: ${updatedBy}
Updated At: ${new Date().toISOString()}

This is an automated notification from the Battery Passport System.
  `;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@batterypassport.com';
  
  await sendNotification(adminEmail, subject, content);
};

const sendPassportDeletedNotification = async (data) => {
  const { batteryIdentifier, deletedBy } = data;
  
  const subject = 'Battery Passport Deleted';
  const content = `
A battery passport has been deleted.

Battery Identifier: ${batteryIdentifier}
Deleted By: ${deletedBy}
Deleted At: ${new Date().toISOString()}

This is an automated notification from the Battery Passport System.
  `;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@batterypassport.com';
  
  await sendNotification(adminEmail, subject, content);
};

module.exports = {
  sendNotification,
  sendPassportCreatedNotification,
  sendPassportUpdatedNotification,
  sendPassportDeletedNotification
}; 