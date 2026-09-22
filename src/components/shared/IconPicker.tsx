import PickerGrid from '@/components/shared/PickerGrid';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import React from 'react';

type LucideComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export interface IconOption {
  id: string;
  component: LucideComponent;
}

interface IIconPicker {
  label?: string;
  icons: IconOption[];
  value: string;
  onChange: (id: string) => void;
}

export default function IconPicker({
  label,
  icons,
  value,
  onChange,
}: IIconPicker) {
  const theme = useCurrentTheme();
  const icon = useIconColors();
  return (
    <div className="flex flex-col gap-2.5">
      {label ? (
        <Text variant="label" className="font-semibold text-foreground">
          {label}
        </Text>
      ) : null}
      <PickerGrid gap={10}>
        {icons.map((item) => {
          const Icon = item.component;
          const active = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer ${
                active
                  ? 'bg-accent-subtle border-accent'
                  : 'bg-card border-subtle-border'
              }`}
            >
              <Icon
                size={20}
                color={active ? theme.colors.accent : icon.muted}
                strokeWidth={1.8}
              />
            </button>
          );
        })}
      </PickerGrid>
    </div>
  );
}
