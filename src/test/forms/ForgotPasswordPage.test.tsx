import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import { forgotPassword } from '@/services/auth.service';
import { toast } from 'sonner';
import { useAuthFlowStore } from '@/stores/authFlowStore';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

vi.mock('@/services/auth.service', () => ({
  forgotPassword: vi.fn().mockResolvedValue({}),
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/forgot-password']} future={FUTURE}>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify" element={<div>Verify Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useAuthFlowStore.setState({ email: null, otpCode: null, mode: null });
  vi.mocked(forgotPassword).mockResolvedValue({});
  vi.mocked(toast.error).mockClear();
});

describe('ForgotPasswordPage', () => {
  it('shows error when email field is submitted empty', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /send reset code/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.clear(screen.getByPlaceholderText('you@example.com'));
    await user.type(screen.getByPlaceholderText('you@example.com'), 'notanemail');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('calls forgotPassword and navigates to /verify on valid submit', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.clear(screen.getByPlaceholderText('you@example.com'));
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));
    await waitFor(() => {
      expect(vi.mocked(forgotPassword)).toHaveBeenCalledWith('test@example.com');
    });
    expect(await screen.findByText('Verify Page')).toBeInTheDocument();
  });

  it('shows error toast when forgotPassword throws', async () => {
    vi.mocked(forgotPassword).mockRejectedValueOnce(new Error('Server error'));
    const user = userEvent.setup();
    renderPage();
    await user.clear(screen.getByPlaceholderText('you@example.com'));
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset code/i }));
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Something went wrong',
        expect.objectContaining({ description: 'Server error' }),
      );
    });
  });
});
