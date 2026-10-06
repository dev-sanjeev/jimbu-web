import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Owns the scroll container for a screen's main content area.
 * Always fills remaining space and scrolls vertically.
 * Use `className` to add page-specific padding, gap, or direction.
 */
export default function ScrollArea({ children, className = '' }: Props) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
