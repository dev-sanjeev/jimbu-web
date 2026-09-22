import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronRight } from 'lucide-react';

interface Props {
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
  showDivider?: boolean;
  onPress?: () => void;
}

export default function CategoryProgressRow({
  name,
  icon,
  color,
  amount,
  percentage,
  showDivider = false,
  onPress,
}: Props) {
  const fallbackColor = color || '#6c63ff';
  const Icon = resolveLucideIcon(icon || 'tag');
  const iconColors = useIconColors();
  const safePct = Math.max(0, Math.min(100, percentage));
  const isPressable = !!onPress;

  return (
    <div
      className={`flex flex-row items-center gap-3 p-4 ${showDivider ? 'border-b border-border' : ''} ${isPressable ? 'cursor-pointer' : ''}`}
      onClick={onPress}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: fallbackColor + '26' }}
      >
        <Icon size={20} color={fallbackColor} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-row justify-between items-center mb-1.5">
          <Text variant="body" className="text-foreground font-semibold truncate">
            {name}
          </Text>
          <Text variant="body" className="font-semibold text-foreground ml-2 flex-shrink-0">
            ${amount.toFixed(2)}
          </Text>
        </div>

        <div className="flex flex-row items-center gap-3">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              style={{
                width: `${safePct}%`,
                backgroundColor: fallbackColor,
                height: '100%',
              }}
            />
          </div>
          <Text variant="caption" className="text-muted-foreground w-16 text-right flex-shrink-0">
            {Number(safePct.toFixed(2))}%
          </Text>
        </div>
      </div>

      {isPressable && (
        <ChevronRight size={18} color={iconColors.default} strokeWidth={2} />
      )}
    </div>
  );
}
