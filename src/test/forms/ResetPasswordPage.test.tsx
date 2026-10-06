import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { resetPassword } from '@/services/auth.service';
import { toast } from 'sonner';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

vi.mock('@/services/auth.service', () => ({
  resetPassword: vi.fn().mockResolvedValue({ message: 'ok' }),
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/reset-password']} future={FUTURE}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/verify" element={<div>Verify Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useAuthFlowStore.setState({ email: null, otpCode: null, mode: null });
  vi.mocked(resetPassword).mockResolvedValue({ message: 'ok' });
  vi.mocked(toast.error).mockClear();
});

describe('ResetPasswordPage', () => {
  it('redirects to /login when email or otpCode is missing', async () => {
    renderPage();
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', otpCode: '123456' });
    const user = userEvent.setup();
    renderPage();
    const [passwordInput] = screen.getAllByPlaceholderText('••••••••••');
    await user.type(passwordInput, 'abc');
    expect(await screen.findByText('At least 10 characters')).toBeInTheDocument();
  });

  it('shows error when password has no uppercase letter', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', otpCode: '123456' });
    const user = userEvent.setup();
    renderPage();
    const [passwordInput] = screen.getAllByPlaceholderText('••••••••••');
    await user.type(passwordInput, 'abcd1234!@');
    expect(await screen.findByText('Include an uppercase letter')).toBeInTheDocument();
  });

  it('shows error when password has no special character', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', otpCode: '123456' });
    const user = userEvent.setup();
    renderPage();
    const [passwordInput] = screen.getAllByPlaceholderText('••••••••••');
    await user.type(passwordInput, 'Abcd12345a');
    expect(await screen.findByText('Include a special character')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', otpCode: '123456' });
    const user = userEvent.setup();
    renderPage();
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••••');
    await user.type(passwordInput, 'Abcd1234!@');
    await user.type(confirmInput, 'different!@');
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('calls resetPassword and navigates to /login on valid submit', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', otpCode: '123456' });
    const user = userEvent.setup();
    renderPage();
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••••');
    await user.type(passwordInput, 'Abcd1234!@');
    await user.type(confirmInput, 'Abcd1234!@');
    await user.click(screen.getByRole('button', { name: /reset password/i }));
    await waitFor(() => {
      expect(vi.mocked(resetPassword)).toHaveBeenCalledWith({
        username: 'test@example.com',
        code: '123456',
        newPassword: 'Abcd1234!@',
      });
    });
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('shows error toast when resetPassword throws', async () => {
    vi.mocked(resetPassword).mockRejectedValueOnce(new Error('Token expired'));
    useAuthFlowStore.setState({ email: 'test@example.com', otpCode: '123456' });
    const user = userEvent.setup();
    renderPage();
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••••');
    await user.type(passwordInput, 'Abcd1234!@');
    await user.type(confirmInput, 'Abcd1234!@');
    await user.click(screen.getByRole('button', { name: /reset password/i }));
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Could not reset password',
        expect.objectContaining({ description: 'Token expired' }),
      );
    });
  });
});
