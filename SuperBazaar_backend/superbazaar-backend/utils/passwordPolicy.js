const passwordRules = [
  { key: 'minLength', message: 'Password must be at least 8 characters.', test: (v) => v.length >= 8 },
  { key: 'lowercase', message: 'Password must include a lowercase letter.', test: (v) => /[a-z]/.test(v) },
  { key: 'uppercase', message: 'Password must include an uppercase letter.', test: (v) => /[A-Z]/.test(v) },
  { key: 'digit', message: 'Password must include a number.', test: (v) => /\d/.test(v) },
  { key: 'symbol', message: 'Password must include a symbol.', test: (v) => /[^A-Za-z0-9]/.test(v) }
];

const validatePassword = (password = '') => {
  const normalized = String(password || '');
  const failedRules = passwordRules.filter((rule) => !rule.test(normalized));
  return {
    ok: failedRules.length === 0,
    errors: failedRules.map((rule) => ({ key: rule.key, message: rule.message }))
  };
};

module.exports = {
  passwordRules,
  validatePassword
};
