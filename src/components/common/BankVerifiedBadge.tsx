import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  bankName?: string;
  className?: string;
}

export function BankVerifiedBadge({ bankName, className = '' }: Props) {
  return (
    <div className={`inline-flex items-center gap-1.5 bg-[#e1f4e3] border border-[#3D8A75]/30 rounded-full px-3 py-1 ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-[#3D8A75]" />
      <span className="text-[11px] font-medium text-[#3D8A75]">
        {bankName ? `${bankName} Verified` : 'Bank Verified'}
      </span>
    </div>
  );
}
