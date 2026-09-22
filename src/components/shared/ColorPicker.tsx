import PickerGrid from '@/components/shared/PickerGrid';
import { Text } from '@/shared/Text';

interface IColorPicker {
  label?: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({
  label,
  colors,
  value,
  onChange,
}: IColorPicker) {
  return (
    <div className="flex flex-col gap-2.5">
      {label ? (
        <Text variant="label" className="text-foreground">
          {label}
        </Text>
      ) : null}
      <PickerGrid gap={14}>
        {colors.map((color) => {
          const active = color === value;
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 ${active ? 'outline outline-2 outline-foreground outline-offset-1' : ''}`}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </button>
          );
        })}
      </PickerGrid>
    </div>
  );
}
