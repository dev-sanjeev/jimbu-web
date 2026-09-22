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

const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
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

  if (!deviceReady) return <LoadingScreen title="Starting up…" subtitle="Initialising Jimbu" />;

  return (
    <div style={theme.vars} className="min-h-screen relative">
      <AuroraBlobs />
      <div className="relative z-10">
        <AppRoutes />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default Sentry.withErrorBoundary(AppContent, {
  fallback: ({ resetError }) => (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4 p-8 text-center">
      <h2 className="text-h2 font-semibold text-foreground">Something went wrong</h2>
      <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <button
        onClick={resetError}
        className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  ),
});
