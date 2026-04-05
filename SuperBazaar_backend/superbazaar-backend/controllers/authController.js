const User = require('../models/User');
const Store = require('../models/Store');
const { generateToken } = require('../utils/jwtUtils');
const { calculateCreditScore } = require('../utils/creditScoring');

const REQUIRED_BUSINESS_DOCS = ['ntn_certificate', 'business_registration', 'bank_statement'];

const normalizeDocuments = (docs = []) => {
  if (!Array.isArray(docs)) return [];
  return docs
    .map((doc) => {
      if (!doc) return null;
      if (typeof doc === 'string') {
        return { type: doc, url: '' };
      }
      if (typeof doc === 'object' && doc.type) {
        return { type: doc.type, url: doc.url || '' };
      }
      return null;
    })
    .filter(Boolean);
};

const computeKycStatus = (user) => {
  const kycData = user.kycData || {};
  const docs = Array.isArray(kycData.documents) ? kycData.documents : [];
  const hasCnic = Boolean(kycData.cnic);
  const hasFingerprint = Boolean(kycData.fingerprintVerified);
  const hasPhoneVerified = Boolean(user.isPhoneVerified);
  const docTypes = new Set(docs.map((d) => d.type));
  const hasBusinessDocs = REQUIRED_BUSINESS_DOCS.every((type) => docTypes.has(type));

  const hasAnyKycData =
    hasCnic ||
    Boolean(kycData.ntn) ||
    Boolean(kycData.bankIBAN) ||
    hasFingerprint ||
    hasPhoneVerified ||
    docs.length > 0;

  const isBusiness = user.userType === 'merchant' || user.userType === 'supplier';
  const isFullyVerified = isBusiness
    ? hasCnic && hasFingerprint && hasPhoneVerified && hasBusinessDocs
    : hasCnic && hasFingerprint && hasPhoneVerified;

  if (isFullyVerified) return 'verified';
  if (hasAnyKycData) return 'submitted';
  return 'pending';
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, userType, businessName, businessAddress } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      userType,
      businessName,
      businessAddress
    });
    
    // If merchant, create store
    if (userType === 'merchant' && businessName) {
      await Store.create({
        owner: user._id,
        name: businessName,
        address: {
          street: businessAddress,
          city: 'Karachi' // Default, can be updated
        }
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// @desc    Submit KYC data
// @route   POST /api/auth/kyc
// @access  Private
const submitKYC = async (req, res) => {
  try {
    const { cnic, ntn, bankIBAN, fingerprintVerified, documents, phoneVerified } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const currentKyc = user.kycData || {};
    const mergedDocsMap = new Map();
    for (const doc of currentKyc.documents || []) {
      if (doc?.type) mergedDocsMap.set(doc.type, doc);
    }
    for (const doc of normalizeDocuments(documents)) {
      mergedDocsMap.set(doc.type, {
        type: doc.type,
        url: doc.url || mergedDocsMap.get(doc.type)?.url || '',
        uploadedAt: new Date()
      });
    }

    user.kycData = {
      ...currentKyc,
      cnic: cnic !== undefined ? cnic : currentKyc.cnic,
      ntn: ntn !== undefined ? ntn : currentKyc.ntn,
      bankIBAN: bankIBAN !== undefined ? bankIBAN : currentKyc.bankIBAN,
      fingerprintVerified:
        fingerprintVerified !== undefined
          ? Boolean(fingerprintVerified)
          : Boolean(currentKyc.fingerprintVerified),
      documents: Array.from(mergedDocsMap.values())
    };

    if (phoneVerified !== undefined) {
      user.isPhoneVerified = Boolean(phoneVerified);
    }

    user.kycStatus = computeKycStatus(user);
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'KYC data submitted successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting KYC data',
      error: error.message
    });
  }
};

// @desc    Verify KYC (Admin only - for MVP, auto-approve)
// @route   PUT /api/auth/kyc/verify/:userId
// @access  Private/Admin
const verifyKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.kycStatus = 'verified';
    
    // Calculate initial credit score for merchants
    if (user.userType === 'merchant') {
      const creditScore = calculateCreditScore(user);
      user.creditScore = creditScore;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'KYC verified successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('KYC verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying KYC',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  submitKYC,
  verifyKYC,
  getMe
};
