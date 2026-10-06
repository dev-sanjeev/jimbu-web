import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@/router/AuthGuard';
import { AuthLayout } from '@/router/AuthLayout';
import { useAuthStore } from '@/stores/authStore';

vi.mock('@/shared/LoadingScreen', () => ({
  default: () => <div>Loading…</div>,
}));

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

const renderGuard = (initialPath = '/protected') =>
  render(
    <MemoryRouter initialEntries={[initialPath]} future={FUTURE}>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

const renderLayout = (initialPath = '/login') =>
  render(
    <MemoryRouter initialEntries={[initialPath]} future={FUTURE}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<div>Auth Page</div>} />
        </Route>
        <Route path="/main" element={<div>Main Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false, isHydrating: false });
});

describe('AuthGuard', () => {
  it('shows loading screen while hydrating', () => {
    useAuthStore.setState({ isHydrating: true });
    renderGuard();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    useAuthStore.setState({ isHydrating: false, isAuthenticated: false });
    renderGuard();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders outlet when authenticated', () => {
    useAuthStore.setState({ isHydrating: false, isAuthenticated: true });
    renderGuard();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

describe('AuthLayout', () => {
  it('shows loading screen while hydrating', () => {
    useAuthStore.setState({ isHydrating: true });
    renderLayout();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByText('Auth Page')).not.toBeInTheDocument();
  });

  it('redirects to /main when already authenticated', () => {
    useAuthStore.setState({ isHydrating: false, isAuthenticated: true });
    renderLayout();
    expect(screen.getByText('Main Page')).toBeInTheDocument();
    expect(screen.queryByText('Auth Page')).not.toBeInTheDocument();
  });

  it('renders outlet when not authenticated', () => {
    useAuthStore.setState({ isHydrating: false, isAuthenticated: false });
    renderLayout();
    expect(screen.getByText('Auth Page')).toBeInTheDocument();
  });
});
