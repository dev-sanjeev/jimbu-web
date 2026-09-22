import React, { forwardRef } from 'react';

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChangeText?: (text: string) => void;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { onChangeText, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={['bg-transparent outline-none w-full', className].filter(Boolean).join(' ')}
      style={rest.style}
      onChange={(e) => onChangeText?.(e.target.value)}
      {...rest}
    />
  );
});
