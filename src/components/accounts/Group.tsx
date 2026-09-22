import { Text } from '@/shared/Text';
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Group({ title, children }: Props) {
  return (
    <div>
      <Text variant="caption" className="text-foreground uppercase tracking-wider mb-2 px-1">
        {title}
      </Text>
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}
