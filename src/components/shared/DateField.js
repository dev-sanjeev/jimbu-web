import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { Calendar, ChevronDown } from 'lucide-react';
import AppCalendar from './AppCalendar';
// Approximate rendered height of the calendar popover in px
const CALENDAR_HEIGHT = 320;
const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
export default function DateField({ label, value, onChange, maximumDate, minimumDate, error, }) {
    const [open, setOpen] = useState(false);
    const [flipUp, setFlipUp] = useState(false);
    const triggerRef = useRef(null);
    const wrapperRef = useRef(null);
    const icon = useIconColors();
    const handleOpen = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setFlipUp(spaceBelow < CALENDAR_HEIGHT + 16);
        }
        setOpen((o) => !o);
    };
    const handleSelect = (date) => {
        if (date) {
            onChange(date);
            setOpen(false);
        }
    };
    const disabledMatchers = [
        ...(maximumDate ? [{ after: maximumDate }] : []),
        ...(minimumDate ? [{ before: minimumDate }] : []),
    ];
    return (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: label }), _jsxs("div", { ref: wrapperRef, className: "relative", children: [_jsxs("button", { ref: triggerRef, type: "button", onClick: handleOpen, className: "flex flex-row items-center h-input px-4 gap-3 rounded-lg bg-card border border-subtle-border cursor-pointer w-full text-left", children: [_jsx(Calendar, { size: 18, color: icon.muted }), _jsx(Text, { variant: "body", className: "flex-1 text-foreground", children: formatDate(value) }), _jsx(ChevronDown, { size: 16, color: icon.subtle })] }), open && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setOpen(false) }), _jsx("div", { className: `absolute left-0 z-50 bg-card border border-subtle-border rounded-xl shadow-card overflow-hidden ${flipUp ? 'bottom-full mb-2' : 'top-full mt-2'}`, children: _jsx(AppCalendar, { mode: "single", selected: value, onSelect: handleSelect, disabled: disabledMatchers.length ? disabledMatchers : undefined, defaultMonth: value }) })] }))] }), error ? (_jsx(Text, { variant: "caption", className: "text-destructive pl-1", children: error })) : null] }));
}
