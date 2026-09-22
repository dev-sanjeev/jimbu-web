import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
export default function SelectField({ label, placeholder, options, value, onChange, error, renderExtra, }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dialogRef = useRef(null);
    const icon = useIconColors();
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return;
        if (open) {
            dialog.showModal();
        }
        else {
            dialog.close();
        }
    }, [open]);
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return;
        const handleClose = () => {
            setOpen(false);
            setSearch('');
        };
        dialog.addEventListener('close', handleClose);
        return () => dialog.removeEventListener('close', handleClose);
    }, []);
    const filtered = options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
    const dismiss = () => {
        setOpen(false);
        setSearch('');
    };
    const handleSelect = (item) => {
        onChange(item);
        dismiss();
    };
    const SelectedIcon = value ? resolveLucideIcon(value.icon) : null;
    return (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Text, { variant: "label", className: "text-foreground", children: label }), _jsxs("button", { type: "button", onClick: () => setOpen(true), className: "flex flex-row items-center h-input px-4 gap-3 rounded-lg bg-card border border-subtle-border cursor-pointer w-full text-left", children: [value && SelectedIcon ? (_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", style: { backgroundColor: value.color + '20' }, children: _jsx(SelectedIcon, { size: 20, color: value.color, strokeWidth: 1.8 }) })) : null, _jsx(Text, { variant: "body", className: `flex-1 ${value ? 'text-foreground' : 'text-muted-foreground'}`, children: value ? value.name : placeholder }), _jsx(ChevronDown, { size: 16, color: icon.subtle })] }), error ? (_jsx(Text, { variant: "caption", className: "text-destructive pl-1", children: error })) : null, _jsxs("dialog", { ref: dialogRef, onClick: (e) => {
                    if (e.target === dialogRef.current)
                        dismiss();
                }, className: `border-none rounded-card p-0 w-11/12 max-w-dialog-md max-h-dropdown overflow-hidden${open ? ' flex flex-col' : ''}`, children: [_jsxs("div", { className: "flex flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-subtle-border flex-shrink-0", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: label }), _jsx("button", { type: "button", onClick: dismiss, className: "border-0 bg-transparent cursor-pointer p-1", children: _jsx(X, { size: 20, color: icon.muted }) })] }), _jsxs("div", { className: "flex flex-row items-center h-11 mx-4 my-3 px-3 gap-2 rounded-lg bg-muted border border-subtle-border flex-shrink-0", children: [_jsx(Search, { size: 16, color: icon.subtle }), _jsx("input", { className: "flex-1 border-0 bg-transparent outline-none text-foreground text-body", placeholder: "Search\u2026", value: search, onChange: (e) => setSearch(e.target.value), autoFocus: true })] }), _jsx("div", { className: "overflow-y-auto py-2", children: filtered.length === 0 ? (_jsx(Text, { variant: "bodySm", className: "text-center text-muted-foreground py-6 block", children: "No results" })) : (filtered.map((item) => {
                            const Icon = resolveLucideIcon(item.icon);
                            const isSelected = value?.id === item.id;
                            return (_jsxs("button", { type: "button", onClick: () => handleSelect(item), className: "flex flex-row items-center w-full px-5 py-3 gap-3 border-0 cursor-pointer text-left", style: { backgroundColor: isSelected ? item.color + '12' : 'transparent' }, children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", style: { backgroundColor: item.color + '20' }, children: _jsx(Icon, { size: 20, color: item.color, strokeWidth: 1.8 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Text, { variant: "bodySm", className: `text-foreground ${isSelected ? 'font-bold' : 'font-medium'}`, children: item.name }), renderExtra ? renderExtra(item) : null] }), isSelected && (_jsx("div", { className: "w-2 h-2 rounded-full flex-shrink-0", style: { backgroundColor: item.color } }))] }, String(item.id)));
                        })) })] })] }));
}
