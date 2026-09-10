'use client';

import { Star } from 'lucide-react';

interface StarRatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function StarRatingInput({ label, value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} className="p-0.5">
            <Star
              className={`w-5 h-5 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}