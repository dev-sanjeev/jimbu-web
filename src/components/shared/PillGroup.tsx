import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { Check } from 'lucide-react';

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface IPillGroup<T extends string> {
  label?: string;
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: IPillGroup<T>) {
  const icon = useIconColors();
  return (
    <div className="flex flex-col gap-2.5">
      {label ? (
        <Text variant="label" className="font-semibold text-foreground">
          {label}
        </Text>
      ) : null}
      <div className="flex flex-row flex-wrap gap-2.5">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`h-10 px-4 rounded-full flex items-center justify-center border flex-row gap-1.5 cursor-pointer ${
                active
                  ? 'bg-accent border-accent'
                  : 'bg-card border-subtle-border'
              }`}
            >
              {active && (
                <Check size={13} color={icon.inverse} strokeWidth={2.5} />
              )}
              <Text
                variant="label"
                className={active ? 'font-semibold text-white' : 'font-medium text-foreground'}
              >
                {option.label}
              </Text>
            </button>
          );
        })}
      </div>
    </div>
  );
}
