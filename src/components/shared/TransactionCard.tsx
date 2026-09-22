import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useIconColors } from '@/hooks/useIconColors';
import { Transaction } from '@/interfaces/Transaction';
import { Text } from '@/shared/Text';
import { ChevronRight } from 'lucide-react';

interface Props {
  tx: Transaction;
  showDivider?: boolean;
  onPress?: () => void;
}

const formatTime = (date: Date) =>
  isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export const TransactionCard = ({
  tx,
  showDivider = false,
  onPress,
}: Props) => {
  const isExpense = tx.type === 'expense';
  const color = tx.categoryColor || '#6c63ff';
  const Icon = resolveLucideIcon(tx.categoryIcon || 'receipt');
  const iconColors = useIconColors();
  const isPressable = !!onPress;

  return (
    <div
      className={`flex flex-row items-center p-4 gap-3 ${showDivider ? 'border-b border-border' : ''} ${isPressable ? 'cursor-pointer' : ''}`}
      onClick={onPress}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '18' }}
      >
        <Icon size={20} color={color} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <Text variant="body" className="text-foreground font-semibold truncate">
          {tx.categoryName}
        </Text>
        <Text variant="caption" className="text-muted-foreground mt-1 block">
          {formatTime(new Date(tx.createdAt))}
        </Text>
      </div>

      <Text
        variant="body"
        className={`font-semibold flex-shrink-0 ${isExpense ? 'text-destructive' : 'text-success'}`}
      >
        ${Number(tx.amount).toFixed(2)}
      </Text>

      {isPressable && (
        <ChevronRight size={16} color={iconColors.default} strokeWidth={2} />
      )}
    </div>
  );
};

export default TransactionCard;
