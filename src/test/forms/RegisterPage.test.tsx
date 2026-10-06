import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '@/pages/auth/RegisterPage';
import { registerUser } from '@/services/auth.service';
import { toast } from 'sonner';
import { useAuthFlowStore } from '@/stores/authFlowStore';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

vi.mock('@/services/auth.service', () => ({
  registerUser: vi.fn().mockResolvedValue({}),
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/register']} future={FUTURE}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<div>Verify Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useAuthFlowStore.setState({ email: null, otpCode: null, mode: null });
  vi.mocked(registerUser).mockResolvedValue({});
  vi.mocked(toast.error).mockClear();
});

describe('RegisterPage', () => {
  it('shows error when first name is too short', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('e.g. Ram'), 'A');
    expect(await screen.findByText('Too short')).toBeInTheDocument();
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'notanemail');
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('submit button is disabled when form is valid but terms are not accepted', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('e.g. Ram'), 'Ram');
    await user.type(screen.getByPlaceholderText('e.g. Sharma'), 'Sharma');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'ram@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    const signUpBtn = screen.getByRole('button', { name: /sign up/i });
    expect(signUpBtn).toBeDisabled();
    // clicking terms enables it
    await user.click(screen.getByText(/I agree to the/i));
    expect(signUpBtn).not.toBeDisabled();
  });

  it('calls registerUser and navigates to /verify on valid submit with terms accepted', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('e.g. Ram'), 'Ram');
    await user.type(screen.getByPlaceholderText('e.g. Sharma'), 'Sharma');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'ram@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByText(/I agree to the/i));
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(vi.mocked(registerUser)).toHaveBeenCalledWith({
        firstName: 'Ram',
        lastName: 'Sharma',
        username: 'ram@example.com',
        password: '12345678',
      });
    });
    expect(await screen.findByText('Verify Page')).toBeInTheDocument();
  });

  it('shows error toast when registerUser throws', async () => {
    vi.mocked(registerUser).mockRejectedValueOnce(new Error('Email already taken'));
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText('e.g. Ram'), 'Ram');
    await user.type(screen.getByPlaceholderText('e.g. Sharma'), 'Sharma');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'ram@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '12345678');
    await user.click(screen.getByText(/I agree to the/i));
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Registration failed',
        expect.objectContaining({ description: 'Email already taken' }),
      );
    });
  });
});
