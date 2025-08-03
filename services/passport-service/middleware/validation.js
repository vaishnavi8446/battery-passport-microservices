const Joi = require('joi');

const batteryPassportSchema = Joi.object({
  data: Joi.object({
    generalInformation: Joi.object({
      batteryIdentifier: Joi.string().required().trim(),
      batteryModel: Joi.object({
        id: Joi.string().required().trim(),
        modelName: Joi.string().required().trim()
      }).required(),
      batteryMass: Joi.number().positive().required(),
      batteryCategory: Joi.string().valid('EV', 'HEV', 'PHEV', 'Other').required(),
      batteryStatus: Joi.string().valid('Original', 'Repurposed', 'Recycled').required(),
      manufacturingDate: Joi.date().iso().required(),
      manufacturingPlace: Joi.string().required().trim(),
      warrantyPeriod: Joi.string().required(),
      manufacturerInformation: Joi.object({
        manufacturerName: Joi.string().required().trim(),
        manufacturerIdentifier: Joi.string().required().trim()
      }).required()
    }).required(),
    materialComposition: Joi.object({
      batteryChemistry: Joi.string().required().trim(),
      criticalRawMaterials: Joi.array().items(Joi.string().trim()),
      hazardousSubstances: Joi.array().items(
        Joi.object({
          substanceName: Joi.string().required().trim(),
          chemicalFormula: Joi.string().required().trim(),
          casNumber: Joi.string().required().trim()
        })
      )
    }).required(),
    carbonFootprint: Joi.object({
      totalCarbonFootprint: Joi.number().positive().required(),
      measurementUnit: Joi.string().default('kg CO2e'),
      methodology: Joi.string().required().trim()
    }).required()
  }).required()
});

const validatePassportData = (req, res, next) => {
  const { error } = batteryPassportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validatePassportData
}; 