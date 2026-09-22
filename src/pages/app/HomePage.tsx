import CategoryProgressRow from '@/components/shared/CategoryProgressRow';
import EmptyMonthCategoriesState from '@/components/shared/EmptyMonthCategoriesState';
import EmptyRecentTransactionsState from '@/components/shared/EmptyRecentTransactionsState';
import HeroCard from '@/components/shared/HeroCard';
import HeroChip from '@/components/shared/HeroChip';
import MonthSpendAreaChart from '@/components/shared/MonthSpendAreaChart';
import MonthTotalCard from '@/components/shared/MonthTotalCard';
import SectionHeader from '@/components/shared/SectionHeader';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import TransactionCard from '@/components/shared/TransactionCard';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useGetTransactionsTimeframe } from '@/hooks/transactions/useGetTransactionsTimeframe';
import { Transaction } from '@/interfaces/Transaction';
import { firstOfMonth, monthBoundsISO } from '@/shared/dateRange';
import { Text } from '@/shared/Text';
import { useAuthStore } from '@/stores/authStore';
import { Plus, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { monthStart, monthEnd, monthDate } = useMemo(() => {
    const anchor = firstOfMonth(new Date());
    const { start, end } = monthBoundsISO(anchor);
    return { monthStart: start, monthEnd: end, monthDate: anchor };
  }, []);

  const {
    data: timeframeData,
    isError: isTimeframeError,
    refetch: refetchTimeframe,
  } = useGetTransactionsTimeframe(monthStart, monthEnd);

  const monthTransactions = useMemo(() => timeframeData?.data ?? [], [timeframeData]);

  const { monthTotal, topCategories } = useMemo(() => {
    const expenses = monthTransactions.filter((t) => t.type === 'expense');
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
      topCategories: Array.from(byCategory.values()).sort((a, b) => b.amount - a.amount).slice(0, 3),
    };
  }, [monthTransactions]);

  const {
    data: myData,
    isError: isTransactionsError,
    refetch: refetchTransactions,
  } = useGetTransactions();

  const recentTransactions: Transaction[] = useMemo(
    () => myData?.pages[0]?.data?.slice(0, 3) ?? [],
    [myData],
  );

  const isError = isTimeframeError || isTransactionsError;

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
        <Text variant="body" className="font-semibold text-foreground">
          Couldn&apos;t load your home screen.
        </Text>
        <button
          type="button"
          className="py-2 px-4 rounded-lg border border-foreground bg-card cursor-pointer"
          onClick={() => { refetchTimeframe(); refetchTransactions(); }}
        >
          <Text variant="label" className="font-semibold text-foreground">Retry</Text>
        </button>
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="flex-1 overflow-y-auto pb-24 relative">
        <HeroCard title={`${user?.firstName},`} subtitle="Here is a simple overview of your everyday finances and your family budget for this month.">
          <HeroChip icon={Wallet} label="Welcome back" />
        </HeroCard>

        <div className="mt-5 bg-card rounded-lg border border-border shadow-card px-5 py-6">
          <MonthTotalCard total={monthTotal} />
          <div className="mt-2">
            <MonthSpendAreaChart transactions={monthTransactions} month={monthDate} />
          </div>
        </div>

        <div className="mt-5">
          <SectionHeader
            title="Top Categories"
            onSeeAllPress={() => navigate('/main/spend-categories')}
          />
          {topCategories.length > 0 ? (
            <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
              {topCategories.map((cat, index) => (
                <CategoryProgressRow
                  key={cat.categoryId}
                  name={cat.name}
                  icon={cat.icon}
                  color={cat.color}
                  amount={cat.amount}
                  percentage={monthTotal > 0 ? (cat.amount / monthTotal) * 100 : 0}
                  showDivider={index < topCategories.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-card px-5 py-5">
              <EmptyMonthCategoriesState
                variant="current"
                onAddExpense={() => navigate('/main/transactions/new')}
              />
            </div>
          )}
        </div>

        <div className="mt-5">
          <SectionHeader
            title="Recent Transactions"
            onSeeAllPress={() => navigate('/main/transactions')}
          />
          {recentTransactions.length > 0 ? (
            <div className="bg-card rounded-lg border border-border shadow-card">
              {recentTransactions.map((tx, index) => (
                <TransactionCard
                  key={tx.id}
                  tx={tx}
                  showDivider={index < recentTransactions.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-card px-5 py-5">
              <EmptyRecentTransactionsState onAddExpense={() => navigate('/main/transactions/new')} />
            </div>
          )}
        </div>
      </div>

      {/* Floating action button */}
      <button
        type="button"
        onClick={() => navigate('/main/transactions/new')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg cursor-pointer border-0 z-10"
      >
        <Plus size={28} color="white" strokeWidth={2.5} />
      </button>
    </ScreenWrapper>
  );
}
