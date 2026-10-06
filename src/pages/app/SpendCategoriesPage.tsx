import CategoryProgressRow from '@/components/shared/CategoryProgressRow';
import EmptyMonthCategoriesState from '@/components/shared/EmptyMonthCategoriesState';
import MonthTotalCard from '@/components/shared/MonthTotalCard';
import SectionHeader from '@/components/shared/SectionHeader';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';
import { useGetTransactionsTimeframe } from '@/hooks/transactions/useGetTransactionsTimeframe';
import { useIconColors } from '@/hooks/useIconColors';
import { firstOfMonth, monthBoundsISO, monthLabel, monthParam } from '@/shared/dateRange';
import { Text } from '@/shared/Text';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpendCategoriesPage() {
  const navigate = useNavigate();
  const icon = useIconColors();

  const [viewedMonth, setViewedMonth] = useState<Date>(() => firstOfMonth(new Date()));

  const currentMonth = useMemo(() => firstOfMonth(new Date()), []);
  const isCurrentMonth = viewedMonth.getTime() === currentMonth.getTime();

  const { start, end } = useMemo(() => monthBoundsISO(viewedMonth), [viewedMonth]);
  const { data, isFetching } = useGetTransactionsTimeframe(start, end);

  const { monthTotal, categories } = useMemo(() => {
    const transactions = data?.data ?? [];
    const expenses = transactions.filter((t) => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

    const byCategory = new Map<number, { categoryId: number; name: string; icon: string; color: string; amount: number }>();
    for (const tx of expenses) {
      const existing = byCategory.get(tx.categoryId);
      const amount = Number(tx.amount);
      if (existing) existing.amount += amount;
      else byCategory.set(tx.categoryId, { categoryId: tx.categoryId, name: tx.categoryName, icon: tx.categoryIcon, color: tx.categoryColor, amount });
    }

    return {
      monthTotal: total,
      categories: Array.from(byCategory.values()).sort((a, b) => b.amount - a.amount),
    };
  }, [data]);

  const showLoading = isFetching && !data;

  return (
    <ScreenWrapper>
      <ScrollArea className="pb-20 pt-3 flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <button
            type="button"
            onClick={() => setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card border-0 cursor-pointer"
          >
            <ChevronLeft size={20} color={icon.default} />
          </button>
          <Text variant="body" className="font-semibold text-foreground">
            {monthLabel(viewedMonth)}
          </Text>
          <button
            type="button"
            onClick={() => {
              if (!isCurrentMonth) setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
            }}
            disabled={isCurrentMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card border-0 cursor-pointer"
            style={{ opacity: isCurrentMonth ? 0.35 : 1 }}
          >
            <ChevronRight size={20} color={icon.default} />
          </button>
        </div>

        <div className="mt-3">
          <MonthTotalCard total={monthTotal} />
        </div>

        <div>
          <SectionHeader title="Expense Breakdown" showSeeAll={false} />
          {showLoading ? (
            <div className="bg-card rounded-lg border border-border shadow-card p-4 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin py-6" />
            </div>
          ) : categories.length > 0 ? (
            <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
              {categories.map((cat, index) => (
                <CategoryProgressRow
                  key={cat.categoryId}
                  name={cat.name}
                  icon={cat.icon}
                  color={cat.color}
                  amount={cat.amount}
                  percentage={monthTotal > 0 ? (cat.amount / monthTotal) * 100 : 0}
                  showDivider={index < categories.length - 1}
                  onPress={() =>
                    navigate(`/main/category-activity?categoryId=${cat.categoryId}&month=${monthParam(viewedMonth)}`)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-card p-4">
              <EmptyMonthCategoriesState
                variant={isCurrentMonth ? 'current' : 'past'}
                monthLabel={monthLabel(viewedMonth)}
                onAddExpense={isCurrentMonth ? () => navigate('/main/transactions/new') : undefined}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </ScreenWrapper>
  );
}
