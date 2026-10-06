import Card from "@/components/shared/Card";
import AddScreenHeader from "@/components/shared/AddScreenHeader";
import HeroChip from "@/components/shared/HeroChip";
import SectionHeader from "@/components/shared/SectionHeader";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import ScrollArea from "@/components/shared/ScrollArea";
import { resolveLucideIcon } from "@/components/accounts/lucideIcon";
import { useDeleteAccount } from "@/hooks/accounts/useDeleteAccount";
import { useGetAccounts } from "@/hooks/accounts/useGetAccounts";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { useIconColors } from "@/hooks/useIconColors";
import { ACCOUNT_TYPE_LABELS, Account } from "@/interfaces/Account";
import { Text } from "@/shared/Text";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Pencil,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-4">
      <Text variant="bodySm" className="font-medium text-foreground">
        {label}
      </Text>
      <Text variant="bodySm" className="font-bold text-foreground">
        {value}
      </Text>
    </div>
  );
}

function Hairline() {
  return <div className="h-px bg-border mx-3" />;
}

export default function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useCurrentTheme();
  const icon = useIconColors();

  const { data: accounts, isLoading } = useGetAccounts();
  const account = (accounts as Account[] | undefined)?.find(
    (a) => String(a.id) === String(id),
  );
  const deleteAccount = useDeleteAccount();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleEdit = () => {
    if (!id) return;
    navigate(`/main/accounts/${id}/edit`);
  };

  const handleDelete = () => {
    if (!id) return;
    setConfirmDeleteOpen(true);
  };

  if (isLoading && !account) {
    return (
      <ScreenWrapper>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </ScreenWrapper>
    );
  }

  if (!account) {
    return (
      <ScreenWrapper>
        <div className="flex-1 flex items-center justify-center py-20">
          <Text variant="body" className="text-muted-foreground">
            Account not found.
          </Text>
        </div>
      </ScreenWrapper>
    );
  }

  const TypeIcon = resolveLucideIcon(account.icon);
  const monthlyIn = account.monthlyIn ?? 0;
  const monthlyOut = account.monthlyOut ?? 0;
  const [gradStart, gradEnd] = theme.colors.heroGradient;

  return (
    <ScreenWrapper>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Account"
        message="This account will be permanently removed. Are you sure?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          deleteAccount.mutate(id!, {
            onSuccess: () => navigate("/main/accounts", { replace: true }),
            onError: () => toast.error("Could not delete the account"),
          });
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
      <AddScreenHeader title={account.name} />
      <ScrollArea className="pb-20 pt-3 flex flex-col gap-5">
        {/* Hero gradient card */}
        <div
          className="rounded-lg p-6"
          style={{
            background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
          }}
        >
          <div className="flex flex-row items-center justify-between">
            <HeroChip icon={TypeIcon} label={ACCOUNT_TYPE_LABELS[account.accountType]} />

            <div className="flex flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleEdit}
                aria-label="Edit account"
                className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center border-0 cursor-pointer"
              >
                <Pencil size={18} color={icon.inverse} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete account"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center border-0 cursor-pointer"
              >
                <Trash2 size={18} color={icon.destructive} />
              </button>
            </div>
          </div>

          <Text variant="caption" className="text-white/80 font-medium uppercase tracking-wider mt-10">
            AVAILABLE BALANCE
          </Text>
          <Text variant="display" className="text-white mt-1">
            {formatCurrency(account.balance ?? 0)}
          </Text>
        </div>

        {/* Monthly in/out */}
        <div className="flex flex-row gap-3">
          <Card className="flex-1 px-4 py-3.5">
            <div className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-success/10 shrink-0">
                <ArrowDownLeft size={20} color={icon.success} />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <Text variant="caption" className="text-muted-foreground">
                  Total In
                </Text>
                <Text variant="label" className="font-bold text-success">
                  +{formatCurrency(monthlyIn)}
                </Text>
              </div>
            </div>
          </Card>

          <Card className="flex-1 px-4 py-3.5">
            <div className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-destructive/10 shrink-0">
                <ArrowUpRight size={20} color={icon.destructive} />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <Text variant="caption" className="text-muted-foreground">
                  Total Out
                </Text>
                <Text variant="label" className="font-bold text-destructive">
                  -{formatCurrency(monthlyOut)}
                </Text>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <Card
          className="px-4 py-3.5"
          onPress={() => navigate(`/main/accounts/${account.id}/transactions`)}
        >
          <div className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-subtle shrink-0">
              <Receipt size={20} color={theme.colors.accent} />
            </div>
            <Text
              variant="body"
              className="flex-1 font-semibold text-foreground"
            >
              View Transactions
            </Text>
            <ChevronRight size={20} color={icon.subtle} strokeWidth={2} />
          </div>
        </Card>

        <Card
          className="px-4 py-3.5"
          onPress={() =>
            navigate(`/main/transactions/new?accountId=${account.id}`)
          }
        >
          <div className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 shrink-0">
              <Plus size={20} color={theme.colors.accent} />
            </div>
            <Text
              variant="body"
              className="flex-1 font-semibold text-foreground"
            >
              Add Transaction
            </Text>
            <ChevronRight size={20} color={icon.subtle} strokeWidth={2} />
          </div>
        </Card>

        {/* Info section */}
        <div className="mt-2">
          <SectionHeader title="Information" showSeeAll={false} />
          <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
            <InfoRow label="Account Name" value={account.name} />
            <Hairline />
            <InfoRow
              label="Account Type"
              value={ACCOUNT_TYPE_LABELS[account.accountType]}
            />
            <Hairline />
            <InfoRow label="Currency" value="AUD ($)" />
          </div>
        </div>
      </ScrollArea>
    </ScreenWrapper>
  );
}
