import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Card from './Card';
import FormActions from './FormActions';
import SelectField from './SelectField';
const defaultValues = {
    categoryId: null,
    type: null,
    dateStart: null,
    dateEnd: null,
    amountMin: '',
    amountMax: '',
};
const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const toApiFilters = (v) => {
    const min = v.amountMin ? parseInt(v.amountMin, 10) : NaN;
    const max = v.amountMax ? parseInt(v.amountMax, 10) : NaN;
    return {
        type: v.type ?? undefined,
        categoryId: v.categoryId ?? undefined,
        startDate: v.dateStart ? toYMD(v.dateStart) : undefined,
        endDate: v.dateEnd ? toYMD(v.dateEnd) : undefined,
        minAmount: Number.isFinite(min) ? min : undefined,
        maxAmount: Number.isFinite(max) ? max : undefined,
    };
};
export default function Filters({ onApply } = {}) {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState(defaultValues);
    const theme = useCurrentTheme();
    const accent = theme.colors.accent;
    const icon = useIconColors();
    const { data: categories } = useGetCategories();
    const update = (key, v) => setValues((p) => ({ ...p, [key]: v }));
    const clearAll = () => {
        setValues(defaultValues);
        onApply?.({});
    };
    const apply = () => {
        onApply?.(toApiFilters(values));
        setOpen(false);
    };
    const selectedCategory = useMemo(() => {
        const all = categories ?? [];
        return all.find((c) => c.id === values.categoryId) ?? null;
    }, [categories, values.categoryId]);
    useEffect(() => {
        if (values.type &&
            selectedCategory &&
            selectedCategory.type !== values.type) {
            update('categoryId', null);
        }
    }, [values.type, selectedCategory]);
    const categoryOptions = useMemo(() => {
        const all = categories ?? [];
        if (!values.type)
            return all;
        return all.filter((c) => c.type === values.type);
    }, [categories, values.type]);
    const Chevron = open ? ChevronUp : ChevronDown;
    const summary = [
        selectedCategory ? selectedCategory.name : 'All categories',
        values.type
            ? values.type === 'expense' ? 'Expense' : 'Income'
            : 'All types',
    ].join(' · ');
    return (_jsxs(Card, { className: "overflow-hidden", children: [_jsxs("button", { type: "button", onClick: () => setOpen((p) => !p), className: "flex flex-row items-center gap-3 px-4 py-3 w-full text-left border-0 bg-transparent cursor-pointer", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center flex-shrink-0", children: _jsx(Filter, { size: 18, color: accent }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: open ? 'Filters' : 'Filters collapsed' }), _jsx(Text, { variant: "caption", className: "text-foreground truncate block", children: open ? 'Refine transactions by category, type, date, amount' : summary })] }), _jsx(Chevron, { size: 20, color: icon.subtle })] }), open && (_jsxs("div", { className: "px-4 pb-4 pt-4 flex flex-col gap-5 border-t border-border", children: [_jsxs("div", { children: [_jsx(Text, { variant: "label", className: "font-semibold text-foreground mb-2", children: "Type" }), _jsx("div", { className: "flex flex-row gap-2", children: ['expense', 'income'].map((t) => {
                                    const selected = values.type === t;
                                    return (_jsx("button", { type: "button", onClick: () => update('type', selected ? null : t), className: `flex-1 py-3 rounded-lg flex items-center justify-center border-0 cursor-pointer ${selected ? 'bg-accent-subtle' : 'bg-muted'}`, children: _jsx(Text, { variant: "label", className: `font-semibold ${selected ? 'text-accent' : 'text-muted-foreground'}`, children: t === 'expense' ? 'Expense' : 'Income' }) }, t));
                                }) })] }), values.type && (_jsx(SelectField, { label: "Category", placeholder: "Select a category", options: categoryOptions, value: selectedCategory, onChange: (item) => update('categoryId', item?.id ?? null) })), _jsxs("div", { children: [_jsx(Text, { variant: "label", className: "font-semibold text-foreground mb-2", children: "Date range" }), _jsxs("div", { className: "flex flex-row gap-2", children: [_jsx("input", { type: "date", value: values.dateStart ? toYMD(values.dateStart) : '', onChange: (e) => {
                                            const d = new Date(e.target.value + 'T00:00:00');
                                            if (!isNaN(d.getTime()))
                                                update('dateStart', d);
                                        }, className: "flex-1 border border-border rounded-lg px-3 py-2 bg-transparent outline-none text-foreground text-body", placeholder: "Start date" }), _jsx("input", { type: "date", value: values.dateEnd ? toYMD(values.dateEnd) : '', onChange: (e) => {
                                            const d = new Date(e.target.value + 'T00:00:00');
                                            if (!isNaN(d.getTime()))
                                                update('dateEnd', d);
                                        }, className: "flex-1 border border-border rounded-lg px-3 py-2 bg-transparent outline-none text-foreground text-body", placeholder: "End date" })] })] }), _jsxs("div", { children: [_jsx(Text, { variant: "label", className: "font-semibold text-foreground mb-2", children: "Amount range" }), _jsxs("div", { className: "flex flex-row gap-2", children: [_jsxs("div", { className: "flex-1 px-3 py-2 rounded-lg bg-background-wash border border-border", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground mb-0.5", children: "Min amount" }), _jsx("input", { value: values.amountMin, onChange: (e) => update('amountMin', e.target.value), placeholder: "$0.00", type: "number", min: "0", className: "border-0 bg-transparent outline-none text-foreground text-body font-bold w-full" })] }), _jsxs("div", { className: "flex-1 px-3 py-2 rounded-lg bg-background-wash border border-border", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground mb-0.5", children: "Max amount" }), _jsx("input", { value: values.amountMax, onChange: (e) => update('amountMax', e.target.value), placeholder: "$500.00", type: "number", min: "0", className: "border-0 bg-transparent outline-none text-foreground text-body font-bold w-full" })] })] })] }), _jsx(FormActions, { onCancel: clearAll, onSave: apply, cancelLabel: "Clear filters", saveLabel: "Apply" })] }))] }));
}
