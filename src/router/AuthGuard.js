import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoadingScreen from '@/shared/LoadingScreen';
export function AuthGuard() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isHydrating = useAuthStore((s) => s.isHydrating);
    const location = useLocation();
    if (isHydrating)
        return _jsx(LoadingScreen, {});
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    return _jsx(Outlet, {});
}
