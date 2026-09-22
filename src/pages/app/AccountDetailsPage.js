import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from "@/components/shared/Card";
import AddScreenHeader from "@/components/shared/AddScreenHeader";
import HeroChip from "@/components/shared/HeroChip";
import SectionHeader from "@/components/shared/SectionHeader";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import { resolveLucideIcon } from "@/components/accounts/lucideIcon";
import { useDeleteAccount } from "@/hooks/accounts/useDeleteAccount";
import { useGetAccounts } from "@/hooks/accounts/useGetAccounts";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { useIconColors } from "@/hooks/useIconColors";
import { ACCOUNT_TYPE_LABELS } from "@/interfaces/Account";
import { Text } from "@/shared/Text";
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Pencil, Plus, Receipt, Trash2, } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
function formatCurrency(amount) {
    return `$${Math.abs(amount).toFixed(2)}`;
}
function InfoRow({ label, value }) {
    return (_jsxs("div", { className: "flex flex-row items-center justify-between px-5 py-4", children: [_jsx(Text, { variant: "bodySm", className: "font-medium text-foreground", children: label }), _jsx(Text, { variant: "bodySm", className: "font-bold text-foreground", children: value })] }));
}
function Hairline() {
    return _jsx("div", { className: "h-px bg-border mx-3" });
}
export default function AccountDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useCurrentTheme();
    const icon = useIconColors();
    const { data: accounts, isLoading } = useGetAccounts();
    const account = accounts?.find((a) => String(a.id) === String(id));
    const deleteAccount = useDeleteAccount();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const handleEdit = () => {
        if (!id)
            return;
        navigate(`/main/accounts/${id}/edit`);
    };
    const handleDelete = () => {
        if (!id)
            return;
        setConfirmDeleteOpen(true);
    };
    if (isLoading && !account) {
        return (_jsx(ScreenWrapper, { children: _jsx("div", { className: "flex-1 flex items-center justify-center py-20", children: _jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" }) }) }));
    }
    if (!account) {
        return (_jsx(ScreenWrapper, { children: _jsx("div", { className: "flex-1 flex items-center justify-center py-20", children: _jsx(Text, { variant: "body", className: "text-muted-foreground", children: "Account not found." }) }) }));
    }
    const TypeIcon = resolveLucideIcon(account.icon);
    const monthlyIn = account.monthlyIn ?? 0;
    const monthlyOut = account.monthlyOut ?? 0;
    const [gradStart, gradEnd] = theme.colors.heroGradient;
    return (_jsxs(ScreenWrapper, { children: [_jsx(ConfirmDialog, { open: confirmDeleteOpen, title: "Delete Account", message: "This account will be permanently removed. Are you sure?", confirmLabel: "Delete", variant: "destructive", onConfirm: () => {
                    setConfirmDeleteOpen(false);
                    deleteAccount.mutate(id, {
                        onSuccess: () => navigate("/main/accounts", { replace: true }),
                        onError: () => toast.error("Could not delete the account"),
                    });
                }, onCancel: () => setConfirmDeleteOpen(false) }), _jsx(AddScreenHeader, { title: account.name }), _jsxs("div", { className: "flex-1 overflow-y-auto pb-20 pt-3 flex flex-col gap-5", children: [_jsxs("div", { className: "rounded-lg p-6", style: {
                            background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
                        }, children: [_jsxs("div", { className: "flex flex-row items-center justify-between", children: [_jsx(HeroChip, { icon: TypeIcon, label: ACCOUNT_TYPE_LABELS[account.accountType] }), _jsxs("div", { className: "flex flex-row items-center gap-2", children: [_jsx("button", { type: "button", onClick: handleEdit, "aria-label": "Edit account", className: "w-10 h-10 rounded-full bg-white/30 flex items-center justify-center border-0 cursor-pointer", children: _jsx(Pencil, { size: 18, color: icon.inverse }) }), _jsx("button", { type: "button", onClick: handleDelete, "aria-label": "Delete account", className: "w-10 h-10 rounded-full bg-card flex items-center justify-center border-0 cursor-pointer", children: _jsx(Trash2, { size: 18, color: icon.destructive }) })] })] }), _jsx(Text, { variant: "caption", className: "text-white/80 font-medium uppercase tracking-wider mt-10", children: "AVAILABLE BALANCE" }), _jsx(Text, { variant: "display", className: "text-white mt-1", children: formatCurrency(account.balance ?? 0) })] }), _jsxs("div", { className: "flex flex-row gap-3", children: [_jsx(Card, { className: "flex-1 px-4 py-3.5", children: _jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center bg-success/10 shrink-0", children: _jsx(ArrowDownLeft, { size: 20, color: icon.success }) }), _jsxs("div", { className: "flex-1 flex flex-col gap-0.5", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground", children: "Total In" }), _jsxs(Text, { variant: "label", className: "font-bold text-success", children: ["+", formatCurrency(monthlyIn)] })] })] }) }), _jsx(Card, { className: "flex-1 px-4 py-3.5", children: _jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center bg-destructive/10 shrink-0", children: _jsx(ArrowUpRight, { size: 20, color: icon.destructive }) }), _jsxs("div", { className: "flex-1 flex flex-col gap-0.5", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground", children: "Total Out" }), _jsxs(Text, { variant: "label", className: "font-bold text-destructive", children: ["-", formatCurrency(monthlyOut)] })] })] }) })] }), _jsx(Card, { className: "px-4 py-3.5", onPress: () => navigate(`/main/accounts/${account.id}/transactions`), children: _jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center bg-accent-subtle shrink-0", children: _jsx(Receipt, { size: 20, color: theme.colors.accent }) }), _jsx(Text, { variant: "body", className: "flex-1 font-semibold text-foreground", children: "View Transactions" }), _jsx(ChevronRight, { size: 20, color: icon.subtle, strokeWidth: 2 })] }) }), _jsx(Card, { className: "px-4 py-3.5", onPress: () => navigate(`/main/transactions/new?accountId=${account.id}`), children: _jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 shrink-0", children: _jsx(Plus, { size: 20, color: theme.colors.accent }) }), _jsx(Text, { variant: "body", className: "flex-1 font-semibold text-foreground", children: "Add Transaction" }), _jsx(ChevronRight, { size: 20, color: icon.subtle, strokeWidth: 2 })] }) }), _jsxs("div", { className: "mt-2", children: [_jsx(SectionHeader, { title: "Information", showSeeAll: false }), _jsxs("div", { className: "bg-card rounded-lg border border-border shadow-card overflow-hidden", children: [_jsx(InfoRow, { label: "Account Name", value: account.name }), _jsx(Hairline, {}), _jsx(InfoRow, { label: "Account Type", value: ACCOUNT_TYPE_LABELS[account.accountType] }), _jsx(Hairline, {}), _jsx(InfoRow, { label: "Currency", value: "AUD ($)" })] })] })] })] }));
}
