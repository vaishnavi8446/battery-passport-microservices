const mongoose = require('mongoose');

const batteryPassportSchema = new mongoose.Schema({
  data: {
    generalInformation: {
      batteryIdentifier: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      batteryModel: {
        id: {
          type: String,
          required: true,
          trim: true
        },
        modelName: {
          type: String,
          required: true,
          trim: true
        }
      },
      batteryMass: {
        type: Number,
        required: true,
        min: 0
      },
      batteryCategory: {
        type: String,
        required: true,
        enum: ['EV', 'HEV', 'PHEV', 'Other']
      },
      batteryStatus: {
        type: String,
        required: true,
        enum: ['Original', 'Repurposed', 'Recycled']
      },
      manufacturingDate: {
        type: Date,
        required: true
      },
      manufacturingPlace: {
        type: String,
        required: true,
        trim: true
      },
      warrantyPeriod: {
        type: String,
        required: true
      },
      manufacturerInformation: {
        manufacturerName: {
          type: String,
          required: true,
          trim: true
        },
        manufacturerIdentifier: {
          type: String,
          required: true,
          trim: true
        }
      }
    },
    materialComposition: {
      batteryChemistry: {
        type: String,
        required: true,
        trim: true
      },
      criticalRawMaterials: [{
        type: String,
        trim: true
      }],
      hazardousSubstances: [{
        substanceName: {
          type: String,
          required: true,
          trim: true
        },
        chemicalFormula: {
          type: String,
          required: true,
          trim: true
        },
        casNumber: {
          type: String,
          required: true,
          trim: true
        }
      }]
    },
    carbonFootprint: {
      totalCarbonFootprint: {
        type: Number,
        required: true,
        min: 0
      },
      measurementUnit: {
        type: String,
        required: true,
        default: 'kg CO2e'
      },
      methodology: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
batteryPassportSchema.index({ 'data.generalInformation.batteryIdentifier': 1 });
batteryPassportSchema.index({ 'data.generalInformation.manufacturingDate': 1 });
batteryPassportSchema.index({ createdAt: 1 });

// Method to get public representation
batteryPassportSchema.methods.toPublicJSON = function() {
  const passportObject = this.toObject();
  delete passportObject.__v;
  return passportObject;
};

module.exports = mongoose.model('BatteryPassport', batteryPassportSchema); 