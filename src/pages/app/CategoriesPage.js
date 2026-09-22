import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeaderCard from '@/components/accounts/HeaderCard';
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import PickerGrid from '@/components/shared/PickerGrid';
import SelectorTab from '@/components/shared/SelectorTab';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { TransactionType } from '@/interfaces/components/ITransaction';
import { Text } from '@/shared/Text';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function CategoriesPage() {
    const navigate = useNavigate();
    const [type, setType] = useState(TransactionType.EXPENSE);
    const { data: allCategories = [], isLoading } = useGetCategories();
    const categories = allCategories.filter((c) => c.type === type);
    const sectionLabel = type === TransactionType.EXPENSE ? 'EXPENSE' : 'INCOME';
    const sectionColor = '#2f6b4f';
    const handleEdit = (cat) => {
        navigate(`/main/categories/${cat.id}/edit?name=${encodeURIComponent(cat.name)}&icon=${cat.icon}&color=${encodeURIComponent(cat.color)}&type=${type}&mode=edit`);
    };
    const handleAdd = () => {
        navigate(`/main/categories/new?mode=add&type=${type}`);
    };
    return (_jsxs(ScreenWrapper, { children: [_jsx(HeaderCard, { title: "Categories", buttonText: "New", onButtonPress: handleAdd }), _jsxs("div", { className: "flex-1 overflow-y-auto pb-8 pt-4 flex flex-col gap-6", children: [_jsx(SelectorTab, { onTypeChange: (newType) => setType(newType) }), _jsxs("div", { className: "flex flex-row items-center mb-4 gap-2", children: [_jsx("div", { className: "w-1 h-4 rounded-sm shrink-0", style: { backgroundColor: sectionColor } }), _jsx(Text, { variant: "caption", className: "font-bold text-muted-foreground uppercase tracking-wider flex-1", children: sectionLabel }), _jsx("div", { className: "px-2 py-0.5 rounded-xl", style: { backgroundColor: sectionColor + '20' }, children: _jsx(Text, { variant: "caption", className: "font-bold", style: { color: sectionColor }, children: categories.length }) })] }), isLoading && (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" }) })), !isLoading && (_jsx(PickerGrid, { itemSize: 80, gap: 12, children: categories.map((cat) => {
                            const Icon = resolveLucideIcon(cat.icon);
                            return (_jsxs("button", { type: "button", onClick: () => handleEdit(cat), className: "bg-card rounded-lg flex flex-col items-center justify-center border border-border gap-2 shadow-sm p-3 cursor-pointer", style: { aspectRatio: '1' }, children: [_jsx("div", { className: "rounded-full flex items-center justify-center", style: { width: '50%', height: '50%', backgroundColor: cat.color + '20' }, children: _jsx(Icon, { size: 20, color: cat.color, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "caption", className: "font-semibold text-foreground text-center line-clamp-2", children: cat.name })] }, cat.id));
                        }) }))] })] }));
}
