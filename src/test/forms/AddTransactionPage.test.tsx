import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import AddTransactionPage from '@/pages/app/AddTransactionPage';
import { server } from '../mocks/server';

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };
const API = 'http://localhost:3000';

const makeRender = (search = '') => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/main/transactions/new${search}`]} future={FUTURE}>
        <Routes>
          <Route path="/main/transactions/new" element={<AddTransactionPage />} />
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
    http.get(`${API}/categories/my`, () =>
      HttpResponse.json({ success: true, data: [] }),
    ),
    http.get(`${API}/transactions`, () =>
      HttpResponse.json({ success: true, data: { data: [], pagination: { hasNextPage: false } } }),
    ),
  );
});

describe('AddTransactionPage', () => {
  it('shows "New Transaction" title in create mode', () => {
    makeRender();
    expect(screen.getByText('New Transaction')).toBeInTheDocument();
  });

  it('shows "Edit Transaction" title in edit mode', () => {
    makeRender('?mode=edit&id=1');
    expect(screen.getByText('Edit Transaction')).toBeInTheDocument();
  });

  it('shows error for zero amount', async () => {
    const user = userEvent.setup();
    makeRender();
    await user.type(screen.getByPlaceholderText('0.00'), '0');
    await user.click(screen.getByRole('button', { name: /save transaction/i }));
    expect(await screen.findByText('Amount must be a positive number')).toBeInTheDocument();
  });

  it('shows error for amount with more than 2 decimal places', async () => {
    const user = userEvent.setup();
    makeRender();
    await user.type(screen.getByPlaceholderText('0.00'), '10.123');
    await user.click(screen.getByRole('button', { name: /save transaction/i }));
    expect(await screen.findByText('Max 2 decimal places allowed')).toBeInTheDocument();
  });

  it('shows discard dialog when cancel is clicked with dirty form', async () => {
    const user = userEvent.setup();
    makeRender();
    await user.type(screen.getByPlaceholderText('Add a note…'), 'test note');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(document.querySelector('dialog')).toHaveAttribute('open');
  });
});
