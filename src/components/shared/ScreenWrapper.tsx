import { useWindowSize } from '@/hooks/useWindowSize';
import React, { ReactNode } from 'react';

const WEB_SIDEBAR_BREAKPOINT = 768;

interface Props {
  children: ReactNode;
}

export const ScreenWrapper = ({ children }: Props) => {
  const { width } = useWindowSize();
  const isWide = width >= WEB_SIDEBAR_BREAKPOINT;
  return (
    <div className={`flex-1 flex flex-col overflow-hidden min-h-0${isWide ? '' : ' px-6'}`}>{children}</div>
  );
};

export default ScreenWrapper;
