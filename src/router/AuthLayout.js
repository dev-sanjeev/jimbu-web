import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoadingScreen from '@/shared/LoadingScreen';
export function AuthLayout() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isHydrating = useAuthStore((s) => s.isHydrating);
    if (isHydrating)
        return _jsx(LoadingScreen, {});
    if (isAuthenticated)
        return _jsx(Navigate, { to: "/main", replace: true });
    return _jsx(Outlet, {});
}
