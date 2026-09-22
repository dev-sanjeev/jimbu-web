import { Text } from '@/shared/Text';
import React from 'react';

interface IFormField {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  icon?: React.ReactNode;
  prefix?: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  secureTextEntry?: boolean;
  type?: React.HTMLInputTypeAttribute;
}

export default function FormField({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  icon,
  prefix,
  error,
  autoCapitalize,
  multiline = false,
  numberOfLines = 4,
  editable = true,
  secureTextEntry = false,
  type,
}: IFormField) {
  const containerClass = multiline
    ? `flex flex-row items-start min-h-textarea px-4 py-3 gap-3 rounded-lg border border-subtle-border ${editable ? 'bg-card' : 'bg-muted'}`
    : `flex flex-row items-center h-input px-4 gap-3 rounded-lg border border-subtle-border ${editable ? 'bg-card' : 'bg-muted'}`;

  const inputType = secureTextEntry ? 'password' : (type ?? 'text');

  return (
    <div className="flex flex-col gap-2">
      <Text variant="label" className="font-semibold text-foreground">
        {label}
      </Text>
      <div className={containerClass}>
        {icon ? <div className={multiline ? 'pt-1' : ''}>{icon}</div> : null}
        {prefix ? (
          <Text variant="body" className="font-medium text-muted-foreground">
            {prefix}
          </Text>
        ) : null}
        {multiline ? (
          <textarea
            className={`flex-1 text-body bg-transparent border-0 outline-none resize-none w-full ${editable ? 'text-foreground' : 'text-muted-foreground'}`}
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            style={{ minHeight: numberOfLines * 24 /* computed from prop — cannot be a static token */ }}
            disabled={!editable}
          />
        ) : (
          <input
            className={`flex-1 text-body bg-transparent border-0 outline-none w-full ${editable ? 'text-foreground' : 'text-muted-foreground'}`}
            value={value}
            type={inputType}
            onChange={(e) => onChangeText(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            disabled={!editable}
          />
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
