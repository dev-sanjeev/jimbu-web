import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  colors?: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
}

export const GradientBackground = ({ children, colors, locations }: Props) => {
  const theme = useCurrentTheme();
  const gradientColors = colors ?? theme.colors.pageGradient;
  const gradientStops = locations ?? theme.colors.pageGradientStops;

  const gradientCss = gradientColors
    .map((c, i) => {
      const stop = gradientStops[i] != null ? ` ${gradientStops[i] * 100}%` : '';
      return `${c}${stop}`;
    })
    .join(', ');

  return (
    <div
      className="flex-1 px-5"
      style={{
        background: `linear-gradient(to bottom, ${gradientCss})`,
        minHeight: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default GradientBackground;
