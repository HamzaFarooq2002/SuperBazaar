const seedData = require('../seeds/openBankingUsers.json');

function normalizePhone(input) {
  if (!input) return null;
  let s = String(input).trim();
  // Remove +92 or 92 prefix
  s = s.replace(/^\+92/, '').replace(/^92/, '');
  // Remove leading 0
  s = s.replace(/^0/, '');
  // Remove all non-digits
  s = s.replace(/\D/g, '');
  // Must be 10 digits starting with 3
  if (s.length === 10 && s.startsWith('3')) return s;
  return null;
}

function normalizeIban(input) {
  if (!input) return null;
  const s = String(input).toUpperCase().replace(/\s/g, '');
  // PK IBAN: PK + 2 digits + 4 alpha + 16 alphanumeric = 24 chars
  if (/^PK\d{2}[A-Z0-9]{20}$/.test(s)) return s;
  return null;
}

function maskPhone(phone) {
  return `+92 *** *** ${phone.slice(-4)}`;
}

function maskIban(iban) {
  return `PK** **** **** **** **** ${iban.slice(-4)}`;
}

function maskCnic(cnic) {
  const parts = cnic.split('-');
  if (parts.length === 3) return `${parts[0]}-*******-${parts[2]}`;
  return '**-*******-*';
}

function lookupByPhoneOrIban({ phone, iban } = {}) {
  const normPhone = normalizePhone(phone);
  const normIban = normalizeIban(iban);

  if (!normPhone && !normIban) return null;

  for (const user of seedData) {
    const seedPhone = normalizePhone(user.phone);
    const seedIban = normalizeIban(user.iban);
    if (normPhone && seedPhone === normPhone) return user;
    if (normIban && seedIban === normIban) return user;
  }
  return null;
}

function getById(id) {
  return seedData.find((u) => u.id === id) || null;
}

function maskRecord(user) {
  return {
    matchId: user.id,
    bankName: user.bankName,
    bankCode: user.bankCode,
    userType: user.userType,
    name: user.name,
    businessName: user.businessName || null,
    businessAddress: user.businessAddress || null,
    phoneMasked: maskPhone(user.phone),
    ibanMasked: maskIban(user.iban),
    cnicMasked: maskCnic(user.cnic),
    creditScore: user.creditScore,
    fields: ['name', 'businessName', 'businessAddress', 'phone', 'iban', 'cnic', 'ntn', 'creditScore']
  };
}

module.exports = { normalizePhone, normalizeIban, lookupByPhoneOrIban, getById, maskRecord };
