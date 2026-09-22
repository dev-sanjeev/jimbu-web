import { Text } from '@/shared/Text';

interface BalanceItem {
  label: string;
  value: string;
  color: string;
}

interface Props {
  title: string;
  items: BalanceItem[];
}

export default function BalanceSummaryCard({ title, items }: Props) {
  return (
    <div className="px-5 pb-6">
      <Text variant="h3" className="text-foreground mb-4">
        {title}
      </Text>
      {items.map((item, index) => (
        <div key={index} className="flex flex-row justify-between py-2.5 border-b border-border">
          <Text variant="bodySm" className="text-muted-foreground">
            {item.label}
          </Text>
          <Text variant="body" className="font-medium" style={{ color: item.color }}>
            {item.value}
          </Text>
        </div>
      ))}
    </div>
  );
}
