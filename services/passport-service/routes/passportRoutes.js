const express = require('express');
const { verifyWithAuthService, requireRole } = require('../../shared/middleware/auth');
const { validatePassportData } = require('../middleware/validation');
const passportController = require('../controllers/passportController');

const router = express.Router();

// All routes require authentication
router.use(verifyWithAuthService);

/**
 * @swagger
 * /api/passports:
 *   get:
 *     summary: List all battery passports
 *     tags: [Passports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for battery identifier
 *     responses:
 *       200:
 *         description: List of passports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PassportsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', passportController.listPassports);

/**
 * @swagger
 * /api/passports/{id}:
 *   get:
 *     summary: Get a specific battery passport
 *     tags: [Passports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passport ID
 *     responses:
 *       200:
 *         description: Passport retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PassportResponse'
 *       404:
 *         description: Passport not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', passportController.getPassport);

/**
 * @swagger
 * /api/passports:
 *   post:
 *     summary: Create a new battery passport
 *     tags: [Passports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePassportRequest'
 *     responses:
 *       201:
 *         description: Passport created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PassportResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', requireRole(['admin']), validatePassportData, passportController.createPassport);

/**
 * @swagger
 * /api/passports/{id}:
 *   put:
 *     summary: Update a battery passport
 *     tags: [Passports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passport ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassportRequest'
 *     responses:
 *       200:
 *         description: Passport updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PassportResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Passport not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', requireRole(['admin']), validatePassportData, passportController.updatePassport);

/**
 * @swagger
 * /api/passports/{id}:
 *   delete:
 *     summary: Delete a battery passport
 *     tags: [Passports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passport ID
 *     responses:
 *       200:
 *         description: Passport deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Passport not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', requireRole(['admin']), passportController.deletePassport);

module.exports = router; 