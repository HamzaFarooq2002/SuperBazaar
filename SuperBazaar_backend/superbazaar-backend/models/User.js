const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  
  // User Type
  userType: {
    type: String,
    enum: ['merchant', 'supplier', 'customer'],
    required: true
  },
  
  // KYC Data
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected'],
    default: 'pending'
  },
  kycLevel: {
    type: Number,
    default: 0
  },
  kycData: {
    cnic: String,
    ntn: String,
    bankIBAN: String,
    fingerprintVerified: {
      type: Boolean,
      default: false
    },
    documents: [{
      type: {
        type: String,
        enum: ['cnic_front', 'cnic_back', 'ntn_certificate', 'business_registration', 'bank_statement']
      },
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Business Info (for merchants/suppliers)
  businessName: String,
  businessAddress: String,
  businessType: String,
  
  // Credit Score
  // Credit Score
creditScore: {
  score: {
    type: Number,
    min: 300,
    max: 850
  },
  band: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
    default: null
  },
  defaultProbability: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  lastCalculated: Date,
  factors: {
    paymentHistory: Number,
    creditUtilization: Number,
    accountAge: Number,
    transactionVolume: Number
  }
},
  
  // Wallet
  walletBalance: {
    type: Number,
    default: 0
  },
  
  // Gamification
  rewardPoints: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: Date
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },

  // Open Banking
  openBanking: {
    enabled: {
      type: Boolean,
      default: false
    },
    autoFetched: { type: Boolean, default: false },
    autoFetchSource: { type: String, default: null },
    bankName: { type: String, default: null },
    bankCode: { type: String, default: null },
    connectedAt: Date,
    lastSyncAt: Date,
    consents: {
      shareBankData: {
        type: Boolean,
        default: false
      },
      shareTransactions: {
        type: Boolean,
        default: false
      },
      shareCreditScore: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Timestamps
  lastLogin: Date
}, {
  timestamps: true
});

userSchema.index(
  { 'kycData.cnic': 1 },
  {
    unique: true,
    partialFilterExpression: { 'kycData.cnic': { $type: 'string' } }
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
