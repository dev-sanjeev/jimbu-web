import Filters from '@/components/shared/Filters';
import TransactionCard from '@/components/shared/TransactionCard';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useGetAccounts } from '@/hooks/accounts/useGetAccounts';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useIconColors } from '@/hooks/useIconColors';
import { Account } from '@/interfaces/Account';
import { Transaction, TransactionFilters } from '@/interfaces/Transaction';
import { Text } from '@/shared/Text';
import { List, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function formatLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (isNaN(date.getTime())) return 'Unknown Date';
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function TransactionsPage() {
  const navigate = useNavigate();
  const icon = useIconColors();

  // When rendered at /accounts/:id/transactions, `id` is the account id
  const { id: accountId } = useParams<{ id?: string }>();

  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetTransactions(accountId, filters);

  const { data: accounts } = useGetAccounts();
  const account = accountId
    ? (accounts as Account[] | undefined)?.find((a) => String(a.id) === String(accountId))
    : undefined;
  const pageTitle = account ? `Transactions for ${account.name}` : undefined;

  const transactions = useMemo<Transaction[]>(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const sections = useMemo(() => {
    const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
      const label = formatLabel(new Date(tx.createdAt));
      if (!acc[label]) acc[label] = [];
      acc[label].push(tx);
      return acc;
    }, {});
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [transactions]);

  const handleTransactionPress = (tx: Transaction) => {
    if (accountId) {
      navigate(`/main/transactions/${tx.id}?accountId=${accountId}`);
    } else {
      navigate(`/main/transactions/${tx.id}`);
    }
  };

  return (
    <ScreenWrapper>
      <div className="flex flex-col flex-1 relative min-h-0">
        {/* Fixed filters header */}
        <div className="shrink-0 z-10">
          {pageTitle && (
            <Text variant="h3" className="text-foreground mb-3">{pageTitle}</Text>
          )}
          <Filters onApply={setFilters} />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto pt-3 pb-24 flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center justify-center pt-24">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center pt-24 gap-3">
              <Text variant="body" className="font-semibold text-foreground">Couldn&apos;t load transactions.</Text>
              <button
                type="button"
                className="py-2 px-4 rounded-lg border border-foreground bg-card cursor-pointer"
                onClick={() => refetch()}
              >
                <Text variant="label" className="font-semibold text-foreground">Retry</Text>
              </button>
            </div>
          )}

          {!isLoading && !isError && sections.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-24 gap-3">
              <List size={20} color={icon.accent} strokeWidth={1.8} />
              <Text variant="body" className="font-semibold text-foreground mt-4">No Transactions</Text>
              <Text variant="bodySm" className="text-muted-foreground mt-2">View all your transactions history</Text>
            </div>
          )}

          {sections.map((section) => (
            <div key={section.title}>
              <Text variant="caption" className="text-muted-foreground uppercase tracking-wider mb-2">{section.title}</Text>
              <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
                {section.data.map((tx, i) => (
                  <TransactionCard
                    key={tx.id}
                    tx={tx}
                    showDivider={i < section.data.length - 1}
                    onPress={() => handleTransactionPress(tx)}
                  />
                ))}
              </div>
            </div>
          ))}

          {hasNextPage && (
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              className="w-full py-3 text-center rounded-lg bg-card border border-border cursor-pointer"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Text variant="label" className="font-semibold text-accent">Load more</Text>
              )}
            </button>
          )}
        </div>

        {/* FAB */}
        <button
          type="button"
          onClick={() => navigate(accountId ? `/main/transactions/new?accountId=${accountId}` : '/main/transactions/new')}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg cursor-pointer border-0 z-10"
        >
          <Plus size={28} color="white" strokeWidth={2.5} />
        </button>
      </div>
    </ScreenWrapper>
  );
}
