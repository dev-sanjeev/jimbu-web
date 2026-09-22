import AddScreenHeader from '@/components/shared/AddScreenHeader';
import SectionHeader from '@/components/shared/SectionHeader';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useGetAccounts } from '@/hooks/accounts/useGetAccounts';
import { useDeleteTransaction } from '@/hooks/transactions/useDeleteTransaction';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useIconColors } from '@/hooks/useIconColors';
import { Account } from '@/interfaces/Account';
import { Text } from '@/shared/Text';
import {
  ArrowDownLeft, ArrowUpRight, Calendar, Hash, Pencil, Tag, Trash2, Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { LucideProps } from 'lucide-react';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

const formatReference = (txId: number) => `#TXN-${String(txId).padStart(6, '0')}`;

interface DetailRowProps {
  icon: React.ComponentType<LucideProps>;
  iconColor: string;
  iconBgStyle?: { backgroundColor: string };
  label: string;
  value: string;
  showDivider?: boolean;
}

function DetailRow({ icon: Icon, iconColor, iconBgStyle, label, value, showDivider = false }: DetailRowProps) {
  return (
    <div className={`flex flex-row items-center gap-3 p-4${showDivider ? ' border-b border-border' : ''}`}>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted shrink-0"
        style={iconBgStyle}
      >
        <Icon size={18} color={iconColor} strokeWidth={1.8} />
      </div>
      <Text variant="caption" className="text-muted-foreground w-20 shrink-0">{label}</Text>
      <Text variant="body" className="text-foreground font-semibold text-right flex-1 truncate">{value}</Text>
    </div>
  );
}

export default function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId') ?? undefined;
  const navigate = useNavigate();
  const iconColors = useIconColors();

  const { data, isLoading } = useGetTransactions(accountId);
  const { data: accounts } = useGetAccounts();

  const tx = useMemo(() => {
    if (!id) return undefined;
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    return all.find((t) => String(t.id) === String(id));
  }, [data, id]);

  const account = (accounts as Account[] | undefined)?.find((a) => String(a.id) === String(accountId));

  const deleteTransaction = useDeleteTransaction();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleEdit = () => {
    if (!id) return;
    navigate(`/main/transactions/new?mode=edit&id=${id}${accountId ? `&accountId=${accountId}` : ''}`);
  };

  const handleDelete = () => {
    if (!id) return;
    setConfirmDeleteOpen(true);
  };

  if (isLoading && !tx) {
    return (
      <ScreenWrapper>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </ScreenWrapper>
    );
  }

  if (!tx) {
    return (
      <ScreenWrapper>
        <div className="flex-1 flex items-center justify-center py-20">
          <Text variant="body" className="text-muted-foreground">Transaction not found.</Text>
        </div>
      </ScreenWrapper>
    );
  }

  const isExpense = tx.type === 'expense';
  const tintColor = tx.categoryColor || '#6c63ff';
  const CategoryIcon = resolveLucideIcon(tx.categoryIcon || 'receipt');
  const TypeIcon = isExpense ? ArrowDownLeft : ArrowUpRight;
  const signedAmount = `${isExpense ? '-' : '+'}$${Number(tx.amount).toFixed(2)}`;

  return (
    <ScreenWrapper>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Transaction"
        message="This can't be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          deleteTransaction.mutate(Number(id), {
            onSuccess: () => navigate(-1),
            onError: () => toast.error('Could not delete the transaction'),
          });
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
      <AddScreenHeader title="Transaction" />
      <div className="flex-1 overflow-y-auto pb-24 pt-3 flex flex-col gap-5">
        {/* Hero card */}
        <div
          className="relative rounded-2xl p-6 flex flex-col items-center"
          style={{ backgroundColor: tintColor + '26' }}
        >
          <div className="absolute top-3 right-3 flex flex-row gap-2">
            <button
              type="button"
              onClick={handleEdit}
              aria-label="Edit transaction"
              className="w-9 h-9 rounded-full bg-card/70 flex items-center justify-center border-0 cursor-pointer"
            >
              <Pencil size={16} color={iconColors.default} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete transaction"
              className="w-9 h-9 rounded-full bg-card/70 flex items-center justify-center border-0 cursor-pointer"
            >
              <Trash2 size={16} color={iconColors.destructive} />
            </button>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center mb-3">
            <CategoryIcon size={28} color={tintColor} strokeWidth={1.8} />
          </div>

          <Text variant="display" className="text-foreground">{signedAmount}</Text>
          <Text variant="caption" className="text-muted-foreground uppercase tracking-wider mt-1">{isExpense ? 'EXPENSE' : 'INCOME'}</Text>

          <div className="flex flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-card mt-3">
            <Tag size={12} color={tintColor} />
            <Text variant="label" className="text-foreground">{tx.categoryName}</Text>
          </div>
        </div>

        {/* Details */}
        <div>
          <SectionHeader title="Details" showSeeAll={false} />
          <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
            <DetailRow icon={Calendar} iconColor={iconColors.muted} label="Date & Time" value={formatDateTime(tx.createdAt)} showDivider />
            <DetailRow
              icon={Tag}
              iconColor={tintColor}
              iconBgStyle={{ backgroundColor: tintColor + '26' }}
              label="Category"
              value={tx.categoryName}
              showDivider
            />
            <DetailRow icon={Wallet} iconColor={iconColors.muted} label="Account" value={account?.name ?? '—'} showDivider />
            <DetailRow
              icon={TypeIcon}
              iconColor={isExpense ? iconColors.destructive : iconColors.success}
              label="Type"
              value={isExpense ? 'Expense' : 'Income'}
              showDivider
            />
            <DetailRow icon={Hash} iconColor={iconColors.muted} label="Reference" value={formatReference(tx.id)} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <SectionHeader title="Notes" showSeeAll={false} />
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            {tx.notes ? (
              <Text variant="body" className="text-foreground">{tx.notes}</Text>
            ) : (
              <Text variant="bodySm" className="text-muted-foreground italic">No notes added for this transaction.</Text>
            )}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
