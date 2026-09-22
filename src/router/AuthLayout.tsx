import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoadingScreen from '@/shared/LoadingScreen';

export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  if (isHydrating) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/main" replace />;
  return <Outlet />;
}
