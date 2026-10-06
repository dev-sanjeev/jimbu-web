import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import LoginPage from '@/pages/auth/LoginPage';
import { loginUser } from '@/services/auth.service';
import { toast } from 'sonner';
import { server } from '../mocks/server';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };
const API = 'http://localhost:3000';

vi.mock('@/services/auth.service', () => ({
  loginUser: vi.fn().mockResolvedValue({}),
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/login']} future={FUTURE}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<div>Main Page</div>} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.mocked(loginUser).mockResolvedValue({});
  vi.mocked(toast.error).mockClear();
});

describe('LoginPage', () => {
  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'notanemail');
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('shows error for password shorter than 8 characters', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '1234567');
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('calls loginUser and navigates to /main on valid submit', async () => {
    server.use(
      http.get(`${API}/auth/me`, () =>
        HttpResponse.json({
          sub: '1',
          username: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          isVerified: true,
        }),
      ),
    );
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(vi.mocked(loginUser)).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: '12345678',
      });
    });
    expect(await screen.findByText('Main Page')).toBeInTheDocument();
  });

  it('shows error toast when loginUser throws', async () => {
    vi.mocked(loginUser).mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Login failed',
        expect.objectContaining({ description: 'Invalid credentials' }),
      );
    });
  });
});
