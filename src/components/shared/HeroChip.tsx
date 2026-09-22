import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Text } from '@/shared/Text';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface HeroChipProps {
  icon: LucideIcon;
  label: string;
}

const HeroChip = ({ icon: Icon, label }: HeroChipProps) => {
  const theme = useCurrentTheme();
  return (
    <div className="flex flex-row items-center gap-2 bg-card px-3 py-1.5 rounded-2xl w-fit">
      <Icon size={16} color={theme.colors.accent} strokeWidth={2} />
      <Text variant="label" className="font-semibold text-accent">
        {label}
      </Text>
    </div>
  );
};

export default HeroChip;
