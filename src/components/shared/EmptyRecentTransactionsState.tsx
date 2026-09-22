import { Text } from '@/shared/Text';

interface Props {
  onAddExpense?: () => void;
}

export default function EmptyRecentTransactionsState({ onAddExpense }: Props) {
  return (
    <div className="flex flex-col items-center py-4">
      <Text variant="bodySm" className="text-muted-foreground">
        No transactions yet
      </Text>
      {onAddExpense && (
        <button
          type="button"
          onClick={onAddExpense}
          className="mt-3 bg-accent rounded-lg px-5 py-2 cursor-pointer border-0"
        >
          <Text variant="label" className="text-white font-semibold">
            + Add expense
          </Text>
        </button>
      )}
    </div>
  );
}
