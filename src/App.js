import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { themes } from '@/shared/Themes';
import { initializeDeviceMetadata } from '@/apiClient';
import LoadingScreen from '@/shared/LoadingScreen';
import { AuroraBlobs } from '@/components/AuroraBlobs';
import AppRoutes from '@/router/AppRoutes';
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
    Sentry.init({ dsn: sentryDsn, tracesSampleRate: 1.0 });
}
function AppContent() {
    const { themeId } = useThemeStore();
    const theme = themes[themeId];
    const [deviceReady, setDeviceReady] = useState(false);
    useEffect(() => {
        Promise.all([
            useAuthStore.getState().hydrate(),
            useThemeStore.getState().hydrateTheme(),
            useAuthFlowStore.getState().hydrateFlow(),
            initializeDeviceMetadata(),
        ]).finally(() => setDeviceReady(true));
    }, []);
    if (!deviceReady)
        return _jsx(LoadingScreen, { title: "Starting up\u2026", subtitle: "Initialising Jimbu" });
    return (_jsxs("div", { style: theme.vars, className: "min-h-screen relative", children: [_jsx(AuroraBlobs, {}), _jsx("div", { className: "relative z-10", children: _jsx(AppRoutes, {}) }), _jsx(Toaster, { richColors: true, position: "top-right" })] }));
}
export default Sentry.withErrorBoundary(AppContent, {
    fallback: ({ resetError }) => (_jsxs("div", { className: "flex min-h-screen items-center justify-center flex-col gap-4 p-8 text-center", children: [_jsx("h2", { className: "text-h2 font-semibold text-foreground", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground", children: "An unexpected error occurred. Please try again." }), _jsx("button", { onClick: resetError, className: "px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity", children: "Try Again" })] })),
});
