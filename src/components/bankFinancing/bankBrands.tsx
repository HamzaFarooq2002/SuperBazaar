import React from 'react';

export type BankBrandMeta = {
  name: string;
  /**
   * Public asset path for the bank logo, e.g. '/bank-logos/hbl.svg'.
   * Drop the file into `public/bank-logos/` and the <img> will load it.
   * If the file is missing, the monogram fallback is shown automatically.
   */
  logo?: string;
  /** Solid brand color used for the monogram tile fallback */
  color: string;
  /** 2-3 letter monogram shown when no logo is available */
  initials: string;
};

const BRANDS: Record<string, BankBrandMeta> = {
  'HBL': { name: 'HBL', logo: '/bank-logos/hbl.png', color: '#0E5A3F', initials: 'HBL' },
  'Meezan Bank': { name: 'Meezan Bank', logo: '/bank-logos/meezan.png', color: '#005F2E', initials: 'MB' },
  'Bank Alfalah': { name: 'Bank Alfalah', logo: '/bank-logos/alfalah.png', color: '#9B1B30', initials: 'BA' },
  'UBL': { name: 'UBL', logo: '/bank-logos/ubl.png', color: '#005CA9', initials: 'UBL' },
  'MCB': { name: 'MCB', logo: '/bank-logos/mcb.png', color: '#1B3A6B', initials: 'MCB' },
  'JS Bank': { name: 'JS Bank', logo: '/bank-logos/jsbank.png', color: '#0F3D7A', initials: 'JS' },
  'Allied Bank': { name: 'Allied Bank', logo: '/bank-logos/abl.png', color: '#7E2B3A', initials: 'ABL' },
  'Standard Chartered Bank': { name: 'Standard Chartered Bank', logo: '/bank-logos/scb.png', color: '#0473EA', initials: 'SCB' }
};

const FALLBACK: BankBrandMeta = {
  name: 'Bank',
  color: '#3D8A75',
  initials: 'BK'
};

export const getBankBrand = (name: string | undefined | null): BankBrandMeta => {
  if (!name) return FALLBACK;
  return BRANDS[name] || { ...FALLBACK, name, initials: name.slice(0, 2).toUpperCase() };
};

type BankBrandTileProps = {
  bank: string;
  size?: number;
  rounded?: 'lg' | 'xl' | 'full';
  className?: string;
};

export function BankBrandTile({ bank, size = 44, rounded = 'xl', className = '' }: BankBrandTileProps) {
  const brand = getBankBrand(bank);
  const [logoFailed, setLogoFailed] = React.useState(false);
  const radius = rounded === 'full' ? '9999px' : rounded === 'lg' ? '12px' : '14px';

  const showLogo = brand.logo && !logoFailed;

  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: showLogo ? '#fff' : brand.color,
        boxShadow: showLogo ? '0 1px 2px rgba(16,37,66,0.12)' : 'none'
      }}
      aria-label={brand.name}
    >
      {showLogo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          onError={() => setLogoFailed(true)}
          style={{ width: '78%', height: '78%', objectFit: 'contain' }}
        />
      ) : (
        <span
          className="text-white font-bold tracking-wide"
          style={{ fontSize: Math.max(11, Math.round(size * 0.32)) }}
        >
          {brand.initials}
        </span>
      )}
    </div>
  );
}
