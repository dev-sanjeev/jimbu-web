import { Text } from '@/shared/Text';
import { TransactionType } from '@/interfaces/Transaction';

interface SelectorProps {
  label: string;
  transactionType: TransactionType;
  activeType: TransactionType;
  onPress: () => void;
}

export default function Selector({
  label,
  transactionType,
  activeType,
  onPress,
}: SelectorProps) {
  const isActive = activeType === transactionType;
  return (
    <button
      type="button"
      onClick={onPress}
      className={`flex-1 py-3 rounded-lg flex items-center justify-center cursor-pointer border-0 ${isActive ? 'bg-background-wash' : 'bg-transparent'}`}
    >
      <Text
        variant="label"
        className={`font-semibold ${isActive ? 'text-accent' : 'text-foreground'}`}
      >
        {label}
      </Text>
    </button>
  );
}
