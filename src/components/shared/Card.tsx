import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

const baseClasses = 'bg-card rounded-lg border border-border shadow-card';

export const Card = ({ children, className, onPress }: Props) => {
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  if (onPress) {
    return (
      <div className={`${classes} cursor-pointer`} onClick={onPress}>
        {children}
      </div>
    );
  }
  return <div className={classes}>{children}</div>;
};

export default Card;
