import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { Transaction } from '@/interfaces/Transaction';
import { Text } from '@/shared/Text';
import { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import TransactionCard from './TransactionCard';

interface CategoryMeta {
  name: string;
  icon: string;
  color: string;
}

interface Props {
  category: CategoryMeta | null;
  transactions: Transaction[];
  total: number;
  isLoading?: boolean;
  month: string;
}

const dayLabel = (date: Date) => {
  if (isNaN(date.getTime())) return 'Unknown Date';
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export default function CategoryActivityView({
  category,
  transactions,
  total,
  isLoading = false,
  month,
}: Props) {
  const fallbackColor = category?.color || '#6c63ff';
  const Icon = resolveLucideIcon(category?.icon || 'tag');

  const sections = useMemo(() => {
    const sorted = transactions
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const grouped = sorted.reduce<Record<string, Transaction[]>>((acc, tx) => {
      const label = dayLabel(new Date(tx.createdAt));
      if (!acc[label]) acc[label] = [];
      acc[label].push(tx);
      return acc;
    }, {});
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [transactions]);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-card flex flex-row rounded-lg border border-border shadow-card gap-2 items-center p-2">
        <div className="w-1/5 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center mb-3"
            style={{ backgroundColor: fallbackColor + '26' }}
          >
            <Icon size={28} color={fallbackColor} strokeWidth={1.8} />
          </div>
        </div>

        <div>
          <Text variant="h3" className="text-foreground">
            {category?.name ?? 'Category'}
          </Text>
          <Text variant="caption" className="text-muted-foreground mb-1">
            {`${month + '-' + transactions.length + ' transactions'}`}
          </Text>
          <Text variant="bodySm" className="text-foreground">
            ${total.toFixed(2)}
          </Text>
        </div>
      </div>

      <div className="mt-5">
        <SectionHeader title="Transactions" showSeeAll={false} />
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border shadow-card p-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin py-6" />
          </div>
        ) : sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.title} className="mb-4">
              <Text variant="caption" className="text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </Text>
              <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
                {section.data.map((tx, i) => (
                  <TransactionCard
                    key={tx.id}
                    tx={tx}
                    showDivider={i < section.data.length - 1}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-card px-5 py-6 flex items-center justify-center">
            <Text variant="bodySm" className="text-muted-foreground">
              No transactions in this category for this month.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
