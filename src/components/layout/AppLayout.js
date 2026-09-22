import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { BrandIcon } from "@/shared/BrandIcon";
import { useIconColors } from "@/hooks/useIconColors";
import { Text } from "@/shared/Text";
const SIDEBAR_BREAKPOINT = 768;
function AppHeader({ isWide, onMenuPress, }) {
    const icon = useIconColors();
    return (_jsxs("div", { className: `flex flex-row items-center gap-2.5 py-4 ${isWide ? "" : "px-6"}`, children: [!isWide && (_jsx("button", { onClick: onMenuPress, className: "rounded-lg flex items-center justify-center hover:bg-muted cursor-pointer", children: _jsx(Menu, { size: 22, color: icon.default, strokeWidth: 1.8 }) })), _jsx(BrandIcon, { size: 28, radius: 8 }), _jsx(Text, { variant: "h2", className: "text-accent", children: "JIMBU" })] }));
}
export function AppLayout() {
    const { width } = useWindowSize();
    const isWide = width >= SIDEBAR_BREAKPOINT;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: `flex h-screen overflow-hidden ${isWide ? "flex-row px-12" : "flex-col"}`, children: [isWide && _jsx(Sidebar, { isWide: true, onClose: () => { } }), !isWide && (_jsxs(_Fragment, { children: [_jsx("div", { className: `fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`, onClick: () => setSidebarOpen(false) }), _jsx(Sidebar, { isWide: false, isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) })] })), _jsxs("div", { className: "flex-1 flex flex-col min-w-0 min-h-0", children: [_jsx(AppHeader, { isWide: isWide, onMenuPress: () => setSidebarOpen(true) }), _jsx("main", { className: "flex-1 min-h-0 overflow-hidden flex flex-col", children: _jsx(Outlet, {}) })] })] }));
}
