const BatteryPassport = require('../models/BatteryPassport');
const { sendMessage } = require('../../../shared/utils/kafka');
const logger = require('../../../shared/utils/logger');

const createPassport = async (req, res) => {
  try {
    const { data } = req.body;
    const userId = req.user.id;

    // Check if battery identifier already exists
    const existingPassport = await BatteryPassport.findOne({
      'data.generalInformation.batteryIdentifier': data.generalInformation.batteryIdentifier
    });

    if (existingPassport) {
      return res.status(409).json({
        error: 'Battery passport already exists',
        message: 'A passport with this battery identifier already exists'
      });
    }

    // Create new passport
    const passport = new BatteryPassport({
      data,
      createdBy: userId
    });

    await passport.save();

    // Emit Kafka event
    await sendMessage('passport.created', {
      passportId: passport._id,
      batteryIdentifier: passport.data.generalInformation.batteryIdentifier,
      createdBy: userId,
      timestamp: new Date().toISOString()
    });

    logger.info(`Battery passport created: ${passport.data.generalInformation.batteryIdentifier}`);

    res.status(201).json({
      message: 'Battery passport created successfully',
      passport: passport.toPublicJSON()
    });
  } catch (error) {
    logger.error('Create passport error:', error);
    res.status(500).json({
      error: 'Creation failed',
      message: 'Unable to create battery passport'
    });
  }
};

const getPassport = async (req, res) => {
  try {
    const { id } = req.params;
    const passport = await BatteryPassport.findById(id).populate('createdBy', 'email');

    if (!passport) {
      return res.status(404).json({
        error: 'Passport not found',
        message: 'Battery passport not found'
      });
    }

    if (!passport.isActive) {
      return res.status(404).json({
        error: 'Passport not found',
        message: 'Battery passport has been deleted'
      });
    }

    res.json({
      passport: passport.toPublicJSON()
    });
  } catch (error) {
    logger.error('Get passport error:', error);
    res.status(500).json({
      error: 'Retrieval failed',
      message: 'Unable to retrieve battery passport'
    });
  }
};

const updatePassport = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const userId = req.user.id;

    const passport = await BatteryPassport.findById(id);

    if (!passport) {
      return res.status(404).json({
        error: 'Passport not found',
        message: 'Battery passport not found'
      });
    }

    if (!passport.isActive) {
      return res.status(404).json({
        error: 'Passport not found',
        message: 'Battery passport has been deleted'
      });
    }

    // Check if battery identifier is being changed and if it already exists
    if (data.generalInformation.batteryIdentifier !== passport.data.generalInformation.batteryIdentifier) {
      const existingPassport = await BatteryPassport.findOne({
        'data.generalInformation.batteryIdentifier': data.generalInformation.batteryIdentifier
      });

      if (existingPassport) {
        return res.status(409).json({
          error: 'Battery identifier already exists',
          message: 'A passport with this battery identifier already exists'
        });
      }
    }

    // Update passport
    passport.data = data;
    passport.updatedBy = userId;
    await passport.save();

    // Emit Kafka event
    await sendMessage('passport.updated', {
      passportId: passport._id,
      batteryIdentifier: passport.data.generalInformation.batteryIdentifier,
      updatedBy: userId,
      timestamp: new Date().toISOString()
    });

    logger.info(`Battery passport updated: ${passport.data.generalInformation.batteryIdentifier}`);

    res.json({
      message: 'Battery passport updated successfully',
      passport: passport.toPublicJSON()
    });
  } catch (error) {
    logger.error('Update passport error:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'Unable to update battery passport'
    });
  }
};

const deletePassport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const passport = await BatteryPassport.findById(id);

    if (!passport) {
      return res.status(404).json({
        error: 'Passport not found',
        message: 'Battery passport not found'
      });
    }

    if (!passport.isActive) {
      return res.status(404).json({
        error: 'Passport not found',
        message: 'Battery passport has already been deleted'
      });
    }

    // Soft delete
    passport.isActive = false;
    passport.updatedBy = userId;
    await passport.save();

    // Emit Kafka event
    await sendMessage('passport.deleted', {
      passportId: passport._id,
      batteryIdentifier: passport.data.generalInformation.batteryIdentifier,
      deletedBy: userId,
      timestamp: new Date().toISOString()
    });

    logger.info(`Battery passport deleted: ${passport.data.generalInformation.batteryIdentifier}`);

    res.json({
      message: 'Battery passport deleted successfully'
    });
  } catch (error) {
    logger.error('Delete passport error:', error);
    res.status(500).json({
      error: 'Deletion failed',
      message: 'Unable to delete battery passport'
    });
  }
};

const listPassports = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    
    if (category) {
      filter['data.generalInformation.batteryCategory'] = category;
    }
    
    if (status) {
      filter['data.generalInformation.batteryStatus'] = status;
    }

    const passports = await BatteryPassport.find(filter)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BatteryPassport.countDocuments(filter);

    res.json({
      passports: passports.map(passport => passport.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('List passports error:', error);
    res.status(500).json({
      error: 'Retrieval failed',
      message: 'Unable to retrieve battery passports'
    });
  }
};

module.exports = {
  createPassport,
  getPassport,
  updatePassport,
  deletePassport,
  listPassports
}; 