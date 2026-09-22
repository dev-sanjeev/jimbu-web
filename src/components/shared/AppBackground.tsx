import React from 'react';

export function AppBackground({ children }: { children: React.ReactNode }) {
  return <div className="web-plus-pattern bg-white flex-1">{children}</div>;
}
