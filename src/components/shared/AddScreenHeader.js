import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function AddScreenHeader({ title, onBack }) {
    const navigate = useNavigate();
    const icon = useIconColors();
    const handleBack = onBack ?? (() => navigate(-1));
    return (_jsxs("div", { className: "flex flex-row items-center", children: [_jsx("button", { type: "button", onClick: handleBack, className: "w-10 h-10 flex items-center justify-center border bg-card border-accent rounded-lg cursor-pointer", children: _jsx(ArrowLeft, { size: 20, color: icon.default, strokeWidth: 2.5 }) }), _jsx(Text, { variant: "h2", className: "ml-5 text-center text-foreground truncate", children: title })] }));
}
