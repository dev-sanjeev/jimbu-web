import React from 'react';

interface IAuthButton {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export default function AuthButton({ children, onPress, disabled = false }: IAuthButton) {
  return (
    <button
      type="button"
      className="h-input rounded-xl flex flex-row items-center justify-center gap-2 bg-accent disabled:opacity-50"
      onClick={onPress}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
