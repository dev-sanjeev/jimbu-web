import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage';
import { verifyAccount, resendResetCode } from '@/services/auth.service';
import { toast } from 'sonner';
import { useAuthFlowStore } from '@/stores/authFlowStore';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

vi.mock('@/services/auth.service', () => ({
  verifyAccount: vi.fn().mockResolvedValue({}),
  resendResetCode: vi.fn().mockResolvedValue({}),
  resendVerificationToken: vi.fn().mockResolvedValue({}),
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/verify']} future={FUTURE}>
      <Routes>
        <Route path="/verify" element={<OtpVerificationPage />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/reset-password" element={<div>Reset Password Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useAuthFlowStore.setState({ email: null, otpCode: null, mode: null });
  vi.mocked(verifyAccount).mockResolvedValue({});
  vi.mocked(resendResetCode).mockResolvedValue({});
  vi.mocked(toast.error).mockClear();
});

describe('OtpVerificationPage', () => {
  it('redirects to /login when email or mode is missing from store', async () => {
    renderPage();
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('shows error when code is submitted empty', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', mode: 'reset' });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByText('Code is required')).toBeInTheDocument();
  });

  it('shows error when fewer than 6 digits are entered', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', mode: 'reset' });
    const user = userEvent.setup();
    renderPage();
    const boxes = screen.getAllByRole('textbox');
    for (let i = 0; i < 5; i++) {
      await user.type(boxes[i], String(i + 1));
    }
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByText('Enter all 6 digits')).toBeInTheDocument();
  });

  it('calls verifyAccount and navigates to /login in register mode', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', mode: 'register' });
    const user = userEvent.setup();
    renderPage();
    const boxes = screen.getAllByRole('textbox');
    for (let i = 0; i < 6; i++) {
      await user.type(boxes[i], String(i + 1));
    }
    await user.click(screen.getByRole('button', { name: /verify/i }));
    await waitFor(() => {
      expect(vi.mocked(verifyAccount)).toHaveBeenCalledWith({
        username: 'test@example.com',
        token: '123456',
      });
    });
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('shows error toast when verifyAccount throws', async () => {
    vi.mocked(verifyAccount).mockRejectedValueOnce(new Error('Invalid token'));
    useAuthFlowStore.setState({ email: 'test@example.com', mode: 'register' });
    const user = userEvent.setup();
    renderPage();
    const boxes = screen.getAllByRole('textbox');
    for (let i = 0; i < 6; i++) {
      await user.type(boxes[i], String(i + 1));
    }
    await user.click(screen.getByRole('button', { name: /verify/i }));
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Verification failed',
        expect.objectContaining({ description: 'Invalid token' }),
      );
    });
  });

  it('calls resendResetCode when Resend code is clicked in reset mode', async () => {
    useAuthFlowStore.setState({ email: 'test@example.com', mode: 'reset' });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText('Resend code'));
    await waitFor(() => {
      expect(vi.mocked(resendResetCode)).toHaveBeenCalledWith('test@example.com');
    });
  });
});
