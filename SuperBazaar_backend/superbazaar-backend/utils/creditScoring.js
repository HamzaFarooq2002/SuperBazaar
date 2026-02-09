// Mock credit scoring algorithm for MVP
// In production, this would integrate with real credit bureaus and banking data

const calculateCreditScore = (user, transactionHistory = []) => {
  let score = 500; // Base score
  
  const factors = {
    paymentHistory: 0,
    creditUtilization: 0,
    accountAge: 0,
    transactionVolume: 0
  };
  
  // Factor 1: KYC Completion (35%)
  if (user.kycStatus === 'verified') {
    score += 100;
    factors.paymentHistory = 35;
  } else if (user.kycStatus === 'submitted') {
    score += 50;
    factors.paymentHistory = 17.5;
  }
  
  // Factor 2: Account Age (15%)
  const accountAgeMonths = Math.floor(
    (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30)
  );
  if (accountAgeMonths >= 6) {
    score += 50;
    factors.accountAge = 15;
  } else if (accountAgeMonths >= 3) {
    score += 30;
    factors.accountAge = 9;
  } else if (accountAgeMonths >= 1) {
    score += 15;
    factors.accountAge = 4.5;
  }
  
  // Factor 3: Transaction Volume (25%)
  if (transactionHistory.length > 0) {
    const totalVolume = transactionHistory.reduce((sum, txn) => sum + txn.amount, 0);
    if (totalVolume > 500000) {
      score += 100;
      factors.transactionVolume = 25;
    } else if (totalVolume > 200000) {
      score += 75;
      factors.transactionVolume = 18.75;
    } else if (totalVolume > 100000) {
      score += 50;
      factors.transactionVolume = 12.5;
    } else if (totalVolume > 50000) {
      score += 25;
      factors.transactionVolume = 6.25;
    }
  }
  
  // Factor 4: Credit Utilization (25%) - For existing credit lines
  // This would be calculated based on existing loans
  if (user.creditScore && user.creditScore.score) {
    // Maintain some continuity with previous score
    const previousScore = user.creditScore.score;
    score = Math.floor((score + previousScore) / 2);
  }
  
  // Ensure score is within valid range
  score = Math.max(300, Math.min(850, score));
  
  return {
    score,
    lastCalculated: new Date(),
    factors
  };
};

// Calculate credit limit based on credit score and business metrics
const calculateCreditLimit = (creditScore, monthlyRevenue = 0) => {
  let limit = 0;
  
  // Base limit based on credit score
  if (creditScore >= 750) {
    limit = 500000; // Excellent
  } else if (creditScore >= 700) {
    limit = 350000; // Good
  } else if (creditScore >= 650) {
    limit = 200000; // Fair
  } else if (creditScore >= 600) {
    limit = 100000; // Average
  } else {
    limit = 50000;  // Poor
  }
  
  // Adjust based on monthly revenue (if available)
  if (monthlyRevenue > 0) {
    const revenueBasedLimit = monthlyRevenue * 2; // 2x monthly revenue
    limit = Math.max(limit, revenueBasedLimit);
  }
  
  // Cap at maximum limit for MVP
  return Math.min(limit, 500000);
};

// Assess risk level for loan application
const assessRiskLevel = (creditScore, loanAmount, creditLimit) => {
  const utilizationRatio = loanAmount / creditLimit;
  
  if (creditScore >= 700 && utilizationRatio <= 0.5) {
    return 'low';
  } else if (creditScore >= 650 && utilizationRatio <= 0.7) {
    return 'medium';
  } else {
    return 'high';
  }
};

module.exports = {
  calculateCreditScore,
  calculateCreditLimit,
  assessRiskLevel
};
