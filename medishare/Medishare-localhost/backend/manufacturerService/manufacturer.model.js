import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  certifyingBody: { type: String, required: true },
  certificateId: { type: String, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  fileUrl: { type: String },
  blockchainHash: { type: String }
});

const TraceabilityStageSchema = new mongoose.Schema({
  stageName: { type: String, required: true },
  timeStamp: { type: Date, required: true },
  location: { type: String, required: true },
  partDetails: { type: String },
  certifications: { type: [CertificationSchema], default: [] }
});

const ManufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },

  laborCompliance: {
    SA8000: { type: Boolean, default: false },
    ILOCompliance: { type: Boolean, default: false },
    aiVerified: { type: Boolean, default: false }
  },

  sourcingTransparency: {
    fairTrade: { type: Boolean, default: false },
    ecoCert: { type: Boolean, default: false },
    otherCerts: { type: [String], default: [] }
  },

  traceability: { type: [TraceabilityStageSchema], default: [] },

  tamperProofLogs: {
    blockchainAnchorTx: { type: String },
    lastAuditHash: { type: String },
    auditTrail: {
      type: [
        {
          updatedAt: { type: Date, default: Date.now },
          changeSummary: String,
          byWhom: String,
          hash: String
        }
      ],
      default: []
    }
  },

  ethicalIndex: {
    score: { type: Number, default: 0 },
    lastCalculated: { type: Date, default: Date.now },
    breakdown: {
      laborCompliance: { type: Number, default: 0 },
      rawMaterialSource: { type: Number, default: 0 },
      packagingTransport: { type: Number, default: 0 },
      transparency: { type: Number, default: 0 },
      misc: { type: Number, default: 0 }
    }
  },

  rawMaterials: {
    type: [
      {
        materialName: { type: String, required: true },
        source: { type: String, required: true },
        geoLocation: { type: String, required: true },
        isRedZone: { type: Boolean, default: false },
        carbonScore: { type: Number, default: 0 }
      }
    ],
    default: []
  },

  certificates: { type: [CertificationSchema], default: [] }

}, {
  timestamps: true
});


// Pre-hook to hash password before saving
ManufacturerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});


// Method to compare hashed passwords
ManufacturerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate JWT token
ManufacturerSchema.methods.generateJWT = async function () {
  return jwt.sign({ id: this._id, email: this.email, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};


export const Manufacturer = mongoose.model('Manufacturer', ManufacturerSchema);