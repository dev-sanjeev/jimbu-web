import { Eye, EyeOff } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Text } from '@/shared/Text';
import { useIconColors } from '@/hooks/useIconColors';

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  error?: string;
  onChangeText?: (value: string) => void;
  value?: string;
  style?: React.CSSProperties;
}

export function InputField({
  label, icon, isPassword, error, style, onBlur, onChangeText, onChange, ...props
}: InputFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const iconColor = useIconColors();

  const borderClass = error
    ? 'border-destructive'
    : isFocused
    ? 'border-accent'
    : 'border-border';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onChangeText?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5" style={style}>
      <Text variant="label" className="text-foreground">
        {label}
      </Text>
      <div
        className={`h-input flex flex-row items-center rounded-xl bg-card border ${borderClass} cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="pl-3.5">
          {icon ? <div className="mr-3">{icon}</div> : null}
        </div>
        <input
          ref={inputRef}
          {...props}
          type={isPassword && !isVisible ? 'password' : 'text'}
          className="flex-1 text-body-sm text-foreground px-3.5 h-full bg-transparent outline-none min-w-0"
          placeholder={props.placeholder}
          value={props.value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            (onBlur as React.FocusEventHandler<HTMLInputElement> | undefined)?.(e);
          }}
        />
        {isPassword && (
          <button
            type="button"
            className="pl-3 pr-3.5 flex items-center"
            onClick={(e) => { e.stopPropagation(); setIsVisible((prev) => !prev); }}
          >
            {isVisible ? (
              <Eye size={20} color={iconColor.subtle} />
            ) : (
              <EyeOff size={20} color={iconColor.subtle} />
            )}
          </button>
        )}
      </div>
      {error ? (
        <Text variant="caption" className="text-destructive pl-1">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
