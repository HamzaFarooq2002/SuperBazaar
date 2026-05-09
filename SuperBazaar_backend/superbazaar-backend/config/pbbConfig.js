module.exports = {
  DEMO_PIN: '12345',
  MAX_PIN_ATTEMPTS: 3,
  AUTH_DELAY_MS: 1500,
  PROCESSING_DELAY_MS: 3000,
  demoMode: process.env.PBB_DEMO_MODE === 'true'
};
