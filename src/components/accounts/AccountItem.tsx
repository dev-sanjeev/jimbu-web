import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronRight } from 'lucide-react';
import { resolveLucideIcon } from './lucideIcon';

interface IAccountItem {
  name: string;
  type: string;
  balance: number;
  iconBg: string;
  iconName: string;
  isPreview?: boolean;
  isLast?: boolean;
  onPress?: () => void;
}

function formatBalance(balance: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(balance);
}

export default function AccountItem({
  name,
  type,
  balance,
  iconBg,
  iconName,
  onPress,
  isPreview = false,
  isLast,
}: IAccountItem) {
  const Icon = resolveLucideIcon(iconName);
  const icon = useIconColors();

  const grouped = isLast !== undefined;

  const standaloneClass =
    'flex flex-row items-center bg-card rounded-xl border border-border shadow-card p-4 gap-3 overflow-hidden';
  const rowClass = `flex flex-row items-center p-4 gap-3 ${isLast ? '' : 'border-b border-border'}`;

  const containerClass = `${grouped ? rowClass : standaloneClass} ${!isPreview && onPress ? 'cursor-pointer' : ''}`;

  return (
    <div className={containerClass} onClick={onPress}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} color={icon.inverse} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Text variant="body" className="text-foreground font-semibold truncate">
          {name}
        </Text>
        <Text variant="caption" className="text-muted-foreground">
          {type}
        </Text>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {!!balance && (
          <Text variant="label" className="font-semibold text-foreground">
            {formatBalance(balance)}
          </Text>
        )}
        {!isPreview && (
          <ChevronRight size={20} color={icon.default} strokeWidth={2} />
        )}
      </div>
    </div>
  );
}
