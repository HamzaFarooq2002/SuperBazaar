import React from 'react';
import { ShieldCheck } from 'lucide-react';

type FacilitatorChipProps = {
  bank?: string;
  variant?: 'light' | 'dark';
};

export function FacilitatorChip({ bank, variant = 'light' }: FacilitatorChipProps) {
  const palette =
    variant === 'dark'
      ? 'bg-white/10 border-white/20 text-white/90'
      : 'bg-[#102542]/5 border-[#102542]/10 text-[#102542]/80';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${palette}`}>
      <ShieldCheck className="w-3.5 h-3.5" />
      <span className="text-[11px] leading-none whitespace-nowrap">
        Facilitated by SuperBazaar
        {bank ? <> · Lender: <span className="font-semibold">{bank}</span></> : null}
      </span>
    </div>
  );
}
