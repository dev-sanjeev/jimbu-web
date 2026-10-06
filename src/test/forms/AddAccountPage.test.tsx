import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import AddAccountPage from '@/pages/app/AddAccountPage';
import { useAuthStore } from '@/stores/authStore';
import { server } from '../mocks/server';

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };
const API = 'http://localhost:3000';

const makeRender = (path: string) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]} future={FUTURE}>
        <Routes>
          <Route path="/main/accounts/new" element={<AddAccountPage />} />
          <Route path="/main/accounts/:id/edit" element={<AddAccountPage />} />
          <Route path="/main" element={<div>Main Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  server.use(
    http.get(`${API}/accounts/my`, () =>
      HttpResponse.json({ success: true, data: [] }),
    ),
  );
});

afterEach(() => {
  useAuthStore.setState({ isAuthenticated: false });
});

describe('AddAccountPage', () => {
  it('shows "New Account" title in create mode', () => {
    makeRender('/main/accounts/new');
    expect(screen.getByText('New Account')).toBeInTheDocument();
  });

  it('shows "Edit Account" title in edit mode', () => {
    makeRender('/main/accounts/1/edit');
    expect(screen.getByText('Edit Account')).toBeInTheDocument();
  });

  it('shows error when account name is submitted empty', async () => {
    const user = userEvent.setup();
    makeRender('/main/accounts/new');
    await user.click(screen.getByRole('button', { name: /save account/i }));
    expect(await screen.findByText('Account name is required')).toBeInTheDocument();
  });

  it('shows discard dialog when cancel is clicked with dirty form', async () => {
    const user = userEvent.setup();
    makeRender('/main/accounts/new');
    await user.type(screen.getByPlaceholderText('e.g. Chase Checking'), 'My Account');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(document.querySelector('dialog')).toHaveAttribute('open');
  });

  it('does not open discard dialog when cancel is clicked with no changes', async () => {
    const user = userEvent.setup();
    makeRender('/main/accounts/new');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(document.querySelector('dialog[open]')).toBeNull();
  });

  it('pre-fills form with account data in edit mode', async () => {
    useAuthStore.setState({ isAuthenticated: true });
    server.use(
      http.get(`${API}/accounts/my`, () =>
        HttpResponse.json({
          success: true,
          data: [{ id: 1, name: 'Chase Checking', accountType: 'bank', balance: 1000, color: '#22c55e', icon: 'landmark' }],
        }),
      ),
    );
    makeRender('/main/accounts/1/edit');
    expect(await screen.findByDisplayValue('Chase Checking')).toBeInTheDocument();
  });
});
