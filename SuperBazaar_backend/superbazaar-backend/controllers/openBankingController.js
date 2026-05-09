const User = require('../models/User');
const { lookupByPhoneOrIban, getById, maskRecord, normalizePhone } = require('../services/openBankingSeedService');
const { generateToken } = require('../utils/jwtUtils');

const lookup = async (req, res) => {
  try {
    const { phone, iban } = req.body;
    if (!phone && !iban) {
      return res.status(400).json({ success: false, message: 'Provide phone or IBAN.' });
    }
    const match = lookupByPhoneOrIban({ phone, iban });
    if (!match) {
      return res.status(404).json({
        success: false,
        code: 'NO_MATCH',
        message: "We couldn't find your bank records. Please complete manual signup below."
      });
    }
    return res.json({ success: true, data: maskRecord(match) });
  } catch (err) {
    console.error('openBanking lookup error:', err);
    res.status(500).json({ success: false, message: 'Lookup error', error: err.message });
  }
};

const confirm = async (req, res) => {
  try {
    const { matchId, consentShareBankData = false, consentShareTransactions = false } = req.body;
    if (!matchId) {
      return res.status(400).json({ success: false, code: 'INVALID_MATCH', message: 'matchId required.' });
    }

    const seedUser = getById(matchId);
    if (!seedUser) {
      return res.status(400).json({ success: false, code: 'INVALID_MATCH', message: 'Match ID not found.' });
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check CNIC uniqueness
    const cnicTaken = await User.findOne({
      _id: { $ne: currentUser._id },
      'kycData.cnic': seedUser.cnic
    }).select('_id');
    if (cnicTaken) {
      return res.status(409).json({
        success: false,
        code: 'CNIC_TAKEN',
        field: 'cnic',
        message: 'CNIC already associated with another account.'
      });
    }

    // Check phone uniqueness
    const normPhone = normalizePhone(seedUser.phone);
    const phoneFull = '0' + normPhone; // 11-digit with leading 0
    const phoneTaken = await User.findOne({
      _id: { $ne: currentUser._id },
      phone: { $in: [normPhone, phoneFull, '+92' + normPhone] }
    }).select('_id');
    if (phoneTaken) {
      return res.status(409).json({
        success: false,
        code: 'PHONE_TAKEN',
        field: 'phone',
        message: 'Phone already associated with another account.'
      });
    }

    // Apply seed data to user
    currentUser.name = seedUser.name;
    if (seedUser.businessName) currentUser.businessName = seedUser.businessName;
    if (seedUser.businessAddress) currentUser.businessAddress = seedUser.businessAddress;
    if (seedUser.businessType) currentUser.businessType = seedUser.businessType;
    currentUser.phone = phoneFull;
    currentUser.kycData = {
      ...(currentUser.kycData || {}),
      cnic: seedUser.cnic,
      ntn: seedUser.ntn || currentUser.kycData?.ntn,
      bankIBAN: seedUser.iban,
      fingerprintVerified: true,
      documents: currentUser.kycData?.documents || []
    };
    currentUser.isPhoneVerified = true;
    currentUser.kycStatus = 'verified';
    currentUser.kycLevel = 2;
    currentUser.openBanking = {
      enabled: true,
      autoFetched: true,
      autoFetchSource: `seed:${matchId}`,
      bankName: seedUser.bankName,
      bankCode: seedUser.bankCode,
      connectedAt: new Date(),
      lastSyncAt: new Date(),
      consents: {
        shareBankData: Boolean(consentShareBankData),
        shareTransactions: Boolean(consentShareTransactions),
        shareCreditScore: false
      }
    };

    // Set credit score from seed
    if (seedUser.creditScore) {
      currentUser.creditScore = {
        score: seedUser.creditScore,
        band: seedUser.creditBand || 'Good',
        defaultProbability: 0.05,
        lastCalculated: new Date(),
        factors: {
          paymentHistory: 80,
          creditUtilization: 20,
          accountAge: 10,
          transactionVolume: 50000
        }
      };
    }

    await currentUser.save();

    const token = generateToken(currentUser._id);
    return res.json({ success: true, data: { user: currentUser.toJSON(), token } });
  } catch (err) {
    console.error('openBanking confirm error:', err);
    if (err.code === 11000) {
      if (err.keyPattern?.['kycData.cnic']) {
        return res.status(409).json({ success: false, code: 'CNIC_TAKEN', field: 'cnic', message: 'CNIC already taken.' });
      }
      if (err.keyPattern?.phone) {
        return res.status(409).json({ success: false, code: 'PHONE_TAKEN', field: 'phone', message: 'Phone already taken.' });
      }
    }
    res.status(500).json({ success: false, message: 'Confirm error', error: err.message });
  }
};

module.exports = { lookup, confirm };
