const { randomBytes } = require('crypto');
const MockPaymentTransaction = require('../models/MockPaymentTransaction');
const pbbConfig = require('../config/pbbConfig');
const { createOrderFromDraft } = require('../services/orderService');

const BANKS = {
  HBL: 'HBL - Habib Bank Limited',
  NBP: 'NBP - National Bank of Pakistan',
  UBL: 'UBL - United Bank Limited',
  FAYSAL: 'Faysal Bank',
  JS: 'JS Bank',
  ALLIED: 'Allied Bank',
  ALFALAH: 'Bank Alfalah',
  MCB: 'MCB Bank'
};

const initiate = async (req, res) => {
  try {
    const { intent, bankCode, orderDraft, applicationId, installmentIndex, amount: bodyAmount } = req.body;
    if (!intent || !bankCode) return res.status(400).json({ success: false, message: 'intent and bankCode required.' });
    if (!BANKS[bankCode]) return res.status(400).json({ success: false, message: 'Invalid bank code.' });

    let amount = 0;
    if (intent === 'order') {
      if (!orderDraft) return res.status(400).json({ success: false, message: 'orderDraft required.' });
      amount = Number(orderDraft.totalAmount || 0);
    } else if (intent === 'bank_financing_repay') {
      amount = Number(bodyAmount || 0);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid intent.' });
    }
    if (amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount.' });

    const sessionId = `pbb_sess_${randomBytes(6).toString('hex')}`;
    const pbbTxn = await MockPaymentTransaction.create({
      sessionId,
      user: req.user.id,
      bankCode,
      bankName: BANKS[bankCode],
      amount,
      intent,
      orderDraft: intent === 'order' ? orderDraft : null,
      meta: intent === 'bank_financing_repay' ? { applicationId, installmentIndex } : {}
    });

    return res.status(201).json({ success: true, data: { sessionId, pbbId: pbbTxn.pbbId, amount, bankName: BANKS[bankCode] } });
  } catch (err) {
    console.error('pbb initiate error:', err);
    return res.status(500).json({ success: false, message: 'Error initiating PBB', error: err.message });
  }
};

const auth = async (req, res) => {
  try {
    const { pin } = req.body;
    const pbbTxn = await MockPaymentTransaction.findOne({ sessionId: req.params.sessionId, user: req.user.id });
    if (!pbbTxn) return res.status(404).json({ success: false, message: 'Session not found.' });
    if (pbbTxn.status === 'FAILED') return res.status(400).json({ success: false, code: 'ACCOUNT_LOCKED', message: 'Too many incorrect attempts. Bank account temporarily locked.' });
    if (pbbTxn.status !== 'INITIATED') return res.status(400).json({ success: false, code: 'INVALID_STATE', message: 'Session is not in INITIATED state.' });

    // Artificial delay
    await new Promise((r) => setTimeout(r, pbbConfig.AUTH_DELAY_MS));

    let pinValid = false;
    if (pbbConfig.demoMode) {
      pinValid = pin === pbbConfig.DEMO_PIN;
    } else {
      pinValid = /^\d{5}$/.test(pin);
    }

    if (!pinValid) {
      pbbTxn.pinAttempts = (pbbTxn.pinAttempts || 0) + 1;
      const attemptsRemaining = pbbConfig.MAX_PIN_ATTEMPTS - pbbTxn.pinAttempts;
      if (pbbTxn.pinAttempts >= pbbConfig.MAX_PIN_ATTEMPTS) {
        pbbTxn.status = 'FAILED';
        pbbTxn.failureReason = 'Account locked';
        pbbTxn.completedAt = new Date();
        await pbbTxn.save();
        return res.status(400).json({ success: false, code: 'ACCOUNT_LOCKED', message: 'Too many incorrect attempts. Bank account temporarily locked.' });
      }
      await pbbTxn.save();
      const code = pbbConfig.demoMode ? 'INVALID_PIN' : 'INVALID_PIN_LENGTH';
      const message = pbbConfig.demoMode ? `Incorrect PIN. Try ${pbbConfig.DEMO_PIN}.` : 'PIN must be 5 digits.';
      return res.status(400).json({ success: false, code, message, data: { attemptsRemaining } });
    }

    pbbTxn.status = 'AUTHED';
    pbbTxn.authedAt = new Date();
    await pbbTxn.save();
    return res.json({ success: true, data: { sessionId: req.params.sessionId, status: 'AUTHED' } });
  } catch (err) {
    console.error('pbb auth error:', err);
    return res.status(500).json({ success: false, message: 'Auth error', error: err.message });
  }
};

const confirm = async (req, res) => {
  try {
    const { consent } = req.body;
    if (!consent) return res.status(400).json({ success: false, message: 'Consent required.' });

    const pbbTxn = await MockPaymentTransaction.findOne({ sessionId: req.params.sessionId, user: req.user.id });
    if (!pbbTxn) return res.status(404).json({ success: false, message: 'Session not found.' });
    if (pbbTxn.status === 'SUCCESS' || pbbTxn.status === 'FAILED') {
      return res.json({
        success: pbbTxn.status === 'SUCCESS',
        code: pbbTxn.status === 'FAILED' ? 'PAYMENT_FAILED' : undefined,
        data: { status: pbbTxn.status, pbbId: pbbTxn.pbbId, failureReason: pbbTxn.failureReason || undefined, orderId: pbbTxn.order }
      });
    }
    if (pbbTxn.status !== 'AUTHED') return res.status(400).json({ success: false, code: 'INVALID_STATE', message: 'Session not authorized.' });

    pbbTxn.consentGiven = true;
    pbbTxn.consentTextSnapshot = `User consented to PBB payment of PKR ${pbbTxn.amount} via ${pbbTxn.bankName} at ${new Date().toISOString()}`;

    await new Promise((r) => setTimeout(r, pbbConfig.PROCESSING_DELAY_MS));

    // SUCCESS PATH (mock PBB always settles successfully after auth + consent)
    let orderId = null;
    let transactionId = null;
    let repaymentPayload = null;

    if (pbbTxn.intent === 'order') {
      const User = require('../models/User');
      const Transaction = require('../models/Transaction');
      const user = await User.findById(req.user.id);
      const order = await createOrderFromDraft({
        userId: String(req.user.id),
        userType: user.userType,
        userName: user.businessName || user.name,
        orderDraft: pbbTxn.orderDraft,
        paymentMethod: 'pbb'
      });
      pbbTxn.order = order._id;
      orderId = order._id;

      const txn = await Transaction.create({
        user: req.user.id,
        type: 'expense',
        category: 'payment_made',
        amount: pbbTxn.amount,
        description: `Pay By Bank payment for order #${order.orderNumber}`,
        relatedOrder: order._id,
        paymentMethod: 'pbb',
        status: 'completed'
      });
      transactionId = txn.transactionId;
    } else if (pbbTxn.intent === 'bank_financing_repay') {
      const { applyLoanRepaymentFromAuthedPbb } = require('./bankFinancingController');
      try {
        repaymentPayload = await applyLoanRepaymentFromAuthedPbb(pbbTxn, req.user.id);
        transactionId = repaymentPayload.transactionId;
      } catch (e) {
        console.error('pbb confirm SNPL repay error:', e);
        const status = e.httpStatus || 500;
        const body = {
          success: false,
          message: e.message || 'Repayment could not be applied.',
          ...(e.code ? { code: e.code } : {}),
          ...(e.minPayment != null ? { minPayment: e.minPayment } : {})
        };
        if (status >= 500) body.error = e.message;
        return res.status(status).json(body);
      }
    }

    pbbTxn.status = 'SUCCESS';
    pbbTxn.completedAt = new Date();
    await pbbTxn.save();

    return res.json({
      success: true,
      data: {
        status: 'SUCCESS',
        pbbId: pbbTxn.pbbId,
        orderId,
        transactionId,
        ...(repaymentPayload ? { repayment: repaymentPayload } : {})
      }
    });
  } catch (err) {
    console.error('pbb confirm error:', err);
    return res.status(500).json({ success: false, message: 'Confirm error', error: err.message });
  }
};

const getSession = async (req, res) => {
  try {
    const pbbTxn = await MockPaymentTransaction.findOne({ sessionId: req.params.sessionId, user: req.user.id }).select('-orderDraft');
    if (!pbbTxn) return res.status(404).json({ success: false, message: 'Session not found.' });
    return res.json({ success: true, data: { sessionId: pbbTxn.sessionId, pbbId: pbbTxn.pbbId, status: pbbTxn.status, bankName: pbbTxn.bankName, amount: pbbTxn.amount, failureReason: pbbTxn.failureReason } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error', error: err.message });
  }
};

module.exports = { initiate, auth, confirm, getSession };
