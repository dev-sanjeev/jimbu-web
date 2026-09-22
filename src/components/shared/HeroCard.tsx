import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Text } from '@/shared/Text';
import React from 'react';

interface HeroCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const HeroCard = ({ title, subtitle, children }: HeroCardProps) => {
  const theme = useCurrentTheme();
  const [color1, color2] = theme.colors.heroGradient;

  return (
    <div
      className="rounded-lg p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      }}
    >
      {children}

      <div className="flex flex-col gap-2 mt-4">
        <Text variant="h2" className="text-white">
          {title}
        </Text>

        {subtitle && (
          <Text variant="body" className="text-white">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
};

export default HeroCard;
