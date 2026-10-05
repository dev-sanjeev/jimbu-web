import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../mocks/server';
import { useAuthStore } from '@/stores/authStore';

const API = 'http://localhost:3000';

const testUser = {
  sub: 'uuid-123',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  isVerified: true,
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isHydrating: true,
};

beforeEach(() => {
  useAuthStore.setState(initialState);
  localStorage.clear();
});

describe('hydrate()', () => {
  it('authenticates when /auth/me returns a user', async () => {
    server.use(
      http.get(`${API}/auth/me`, () => HttpResponse.json(testUser)),
    );

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isHydrating).toBe(false);
    expect(state.user?.username).toBe('testuser');
    expect(state.user?.sub).toBe('uuid-123');
  });

  it('retries /auth/me after a successful /auth/refresh', async () => {
    let meCallCount = 0;
    server.use(
      http.get(`${API}/auth/me`, () => {
        meCallCount += 1;
        if (meCallCount === 1) return new HttpResponse(null, { status: 401 });
        return HttpResponse.json(testUser);
      }),
      http.post(`${API}/auth/refresh`, () =>
        HttpResponse.json({ success: true }),
      ),
    );

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isHydrating).toBe(false);
    expect(meCallCount).toBe(2);
  });

  it('sets unauthenticated when /auth/me 401 and /auth/refresh also fails', async () => {
    server.use(
      http.get(`${API}/auth/me`, () => new HttpResponse(null, { status: 401 })),
      http.post(`${API}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
    );

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isHydrating).toBe(false);
  });

  it('sets unauthenticated on network error', async () => {
    server.use(
      http.get(`${API}/auth/me`, () => HttpResponse.error()),
    );

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isHydrating).toBe(false);
  });

  it('always sets isHydrating to false regardless of outcome', async () => {
    server.use(
      http.get(`${API}/auth/me`, () => new HttpResponse(null, { status: 500 })),
    );

    await useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isHydrating).toBe(false);
  });
});

describe('logout()', () => {
  beforeEach(async () => {
    // Start each logout test from an authenticated state
    useAuthStore.setState({ user: testUser, isAuthenticated: true, isHydrating: false });
  });

  it('clears state after successful logout', async () => {
    server.use(
      http.post(`${API}/auth/logout`, () => HttpResponse.json({ success: true })),
    );

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('clears state even when logout API call fails', async () => {
    server.use(
      http.post(`${API}/auth/logout`, () => HttpResponse.error()),
    );

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe('clearSession()', () => {
  it('resets auth state without making a network call', () => {
    useAuthStore.setState({ user: testUser, isAuthenticated: true, isHydrating: false });

    useAuthStore.getState().clearSession();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
