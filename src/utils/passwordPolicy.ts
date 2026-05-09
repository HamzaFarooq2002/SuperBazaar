export type PasswordRule = {
  key: 'minLength' | 'lowercase' | 'uppercase' | 'digit' | 'symbol';
  label: string;
  test: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  { key: 'minLength', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'lowercase', label: 'At least one lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'uppercase', label: 'At least one uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'digit', label: 'At least one number', test: (v) => /\d/.test(v) },
  { key: 'symbol', label: 'At least one symbol', test: (v) => /[^A-Za-z0-9]/.test(v) }
];

export const validatePassword = (password: string) =>
  passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(password || '')
  }));
