import SectionHeader from '@/components/shared/SectionHeader';
import TransactionCard from '@/components/shared/TransactionCard';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { useGetTransactionsTimeframe } from '@/hooks/transactions/useGetTransactionsTimeframe';
import { monthBoundsISO, monthLabel, parseMonthParam } from '@/shared/dateRange';
import { groupTransactionsByDay } from '@/shared/transactions';
import { Text } from '@/shared/Text';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SpendCategoryActivityPage() {
  const [searchParams] = useSearchParams();
  const categoryIdRaw = searchParams.get('categoryId');
  const monthRaw = searchParams.get('month') ?? undefined;

  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : undefined;
  const month = useMemo(() => parseMonthParam(monthRaw), [monthRaw]);
  const { start, end } = useMemo(() => monthBoundsISO(month), [month]);

  const { data, isFetching } = useGetTransactionsTimeframe(start, end);
  const { data: categories } = useGetCategories();

  const { transactions, total, percentage, category } = useMemo(() => {
    const all = data?.data ?? [];
    const monthExpenses = all.filter((t) => t.type === 'expense');
    const monthSum = monthExpenses.reduce((acc, t) => acc + Number(t.amount), 0);
    const filtered = categoryId !== undefined ? monthExpenses.filter((t) => t.categoryId === categoryId) : [];
    const sum = filtered.reduce((acc, t) => acc + Number(t.amount), 0);
    const pct = monthSum > 0 ? (sum / monthSum) * 100 : 0;

    const first = filtered[0];
    const meta = first
      ? { name: first.categoryName, icon: first.categoryIcon, color: first.categoryColor }
      : (() => {
          const fallback = categories?.find((c) => c.id === categoryId);
          return fallback ? { name: fallback.name, icon: fallback.icon, color: fallback.color } : null;
        })();

    return { transactions: filtered, total: sum, percentage: pct, category: meta };
  }, [data, categories, categoryId]);

  const sections = useMemo(() => {
    const sorted = transactions.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return groupTransactionsByDay(sorted);
  }, [transactions]);

  const Icon = resolveLucideIcon(category?.icon ?? 'tag');
  const safePct = Math.max(0, Math.min(100, percentage));
  const tintColor = category?.color ?? '#6c63ff';

  return (
    <ScreenWrapper>
      <ScrollArea className="pb-20 pt-3 flex flex-col gap-5">
        <div className="bg-card rounded-lg flex flex-row gap-4 p-4 items-start border border-border shadow-card">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: tintColor + '26' }}
          >
            <Icon size={28} color={tintColor} strokeWidth={1.8} />
          </div>

          <div className="flex-1 min-w-0">
            <Text variant="h2" className="text-foreground">{category?.name ?? 'Category'}</Text>
            <Text variant="caption" className="text-muted-foreground mb-3">
              {`${monthLabel(month)} · ${transactions.length} transactions`}
            </Text>

            <div className="flex flex-row gap-6 mb-3">
              <div>
                <Text variant="h3" className="text-foreground">${total.toFixed(2)}</Text>
                <Text variant="caption" className="text-muted-foreground">Total Spent</Text>
              </div>
              <div>
                <Text variant="h3">{safePct.toFixed(2)}%</Text>
                <Text variant="caption" className="text-muted-foreground">of Monthly</Text>
              </div>
            </div>

            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div style={{ width: `${safePct}%`, backgroundColor: tintColor, height: '100%' }} />
            </div>
          </div>
        </div>

        <div>
          <SectionHeader title="Transactions" showSeeAll={false} />
          {isFetching && !data ? (
            <div className="bg-card rounded-lg border border-border shadow-card p-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin my-6" />
            </div>
          ) : sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.title} className="mb-4">
                <Text variant="caption" className="text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </Text>
                <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
                  {section.data.map((tx, i) => (
                    <TransactionCard key={tx.id} tx={tx} showDivider={i < section.data.length - 1} />
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
      </ScrollArea>
    </ScreenWrapper>
  );
}
