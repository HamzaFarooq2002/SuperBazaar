import React from 'react';

type Props = { open: boolean; onAccept: () => void; onClose: () => void; payload: any };

export function NanoConsentModal({ open, onAccept, onClose, payload }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md">
        <p className="text-lg text-[#102542] mb-3">Nano Loan Consent</p>
        <p className="text-sm text-gray-600 mb-4">Service charge rate: {((payload?.serviceChargeRate || 0) * 100).toFixed(2)}%</p>
        <div className="flex gap-2">
          <button className="flex-1 border rounded-lg py-2" onClick={onClose}>Cancel</button>
          <button className="flex-1 bg-[#3D8A75] text-white rounded-lg py-2" onClick={onAccept}>I Agree</button>
        </div>
      </div>
    </div>
  );
}
