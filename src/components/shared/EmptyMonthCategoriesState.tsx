import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { PieChart } from 'lucide-react';

interface Props {
  variant: 'current' | 'past';
  monthLabel?: string;
  onAddExpense?: () => void;
}

export default function EmptyMonthCategoriesState({
  variant,
  monthLabel,
  onAddExpense,
}: Props) {
  const isPast = variant === 'past';
  const icon = useIconColors();

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted mb-3">
        <PieChart size={20} color={icon.subtle} strokeWidth={1.8} />
      </div>

      <Text variant="body" className="font-semibold text-foreground text-center">
        {isPast
          ? `No expenses recorded for ${monthLabel ?? 'this period'}`
          : 'No expenses yet this month'}
      </Text>

      {!isPast && (
        <>
          <Text variant="bodySm" className="text-muted-foreground text-center mt-1">
            Add one to see where your money goes
          </Text>
          {onAddExpense && (
            <button
              type="button"
              onClick={onAddExpense}
              className="mt-4 bg-accent rounded-lg px-5 py-2.5 cursor-pointer border-0"
            >
              <Text variant="label" className="text-white font-semibold">
                + Add expense
              </Text>
            </button>
          )}
        </>
      )}
    </div>
  );
}
