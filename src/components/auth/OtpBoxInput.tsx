import React, { useRef } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';

interface OtpBoxInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
}

export function OtpBoxInput({ value, onChange, error }: OtpBoxInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const { width } = useWindowSize();
  const fontSizeClass = width < 320 ? 'text-body' : width < 375 ? 'text-body' : 'text-h2';

  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(''));
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        onChange(next.join(''));
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = '';
        onChange(next.join(''));
        refs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex flex-row gap-2 justify-center w-full">
      {digits.map((digit, i) => {
        const isFilled = digit.length > 0;
        const borderClass = error
          ? 'border-destructive'
          : isFilled
          ? 'border-accent'
          : 'border-border';
        return (
          <div
            key={i}
            className={`flex-1 rounded-xl bg-card border-2 ${borderClass} flex items-center justify-center`}
            style={{ maxWidth: 44, aspectRatio: '1', minHeight: 32 }}
          >
            <input
              ref={(el) => { refs.current[i] = el; }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              inputMode="numeric"
              maxLength={2}
              className={`w-full h-full text-center text-foreground font-semibold bg-transparent outline-none ${fontSizeClass}`}
              onFocus={(e) => e.target.select()}
            />
          </div>
        );
      })}
    </div>
  );
}
