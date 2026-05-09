import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { validatePassword } from '../../utils/passwordPolicy';

type Props = {
  password: string;
};

export function PasswordStrengthChecklist({ password }: Props) {
  const results = validatePassword(password);

  return (
    <div className="mt-2 space-y-1">
      {results.map((rule) => (
        <div key={rule.key} className="flex items-center gap-2 text-xs">
          {rule.passed ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-gray-400" />
          )}
          <span className={rule.passed ? 'text-green-700' : 'text-gray-500'}>{rule.label}</span>
        </div>
      ))}
    </div>
  );
}
