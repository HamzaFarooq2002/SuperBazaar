const User = require('../models/User');
const Store = require('../models/Store');
const { generateToken } = require('../utils/jwtUtils');
const { calculateCreditScore } = require('../utils/creditScoring');

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
    const { cnic, ntn, bankIBAN, fingerprintVerified } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update KYC data
    user.kycData = {
      cnic,
      ntn,
      bankIBAN,
      fingerprintVerified: fingerprintVerified || false
    };
    user.kycStatus = 'submitted';
    
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
