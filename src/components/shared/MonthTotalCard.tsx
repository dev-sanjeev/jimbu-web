import { Text } from '@/shared/Text';

interface Props {
  total: number;
  label?: string;
}

export default function MonthTotalCard({
  total,
  label = 'Total spent this month',
}: Props) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card px-2 py-8 flex flex-col items-center">
      <Text variant="caption" className="text-muted-foreground mb-1">
        {label}
      </Text>
      <Text variant="display" className="text-foreground">
        ${total.toFixed(2)}
      </Text>
    </div>
  );
}
