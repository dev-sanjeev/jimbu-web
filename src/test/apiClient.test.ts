import { AxiosInstance } from 'axios';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiClient, setAuthFailureHandler } from '@/apiClient';
import { server } from './mocks/server';

const API = 'http://localhost:3000';

const makeDeps = () => ({
  baseURL: API,
  getToken: () => null as string | null,
  getCachedDeviceId: () => 'test-device-id',
  getCachedDeviceName: () => 'test-device-name',
});

let client: AxiosInstance;
let authFailureMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  authFailureMock = vi.fn();
  setAuthFailureHandler(authFailureMock as () => void);
  client = createApiClient(makeDeps());
});

describe('response envelope unwrapping', () => {
  it('unwraps { success: true, data: ... } into res.data', async () => {
    server.use(
      http.get(`${API}/test`, () =>
        HttpResponse.json({ success: true, data: { id: 1 } }),
      ),
    );

    const res = await client.get('/test');

    expect(res.data).toEqual({ id: 1 });
  });

  it('passes through non-envelope responses unchanged', async () => {
    server.use(
      http.get(`${API}/test`, () =>
        HttpResponse.json({ message: 'ok' }),
      ),
    );

    const res = await client.get('/test');

    expect(res.data).toEqual({ message: 'ok' });
  });
});

describe('401 handling', () => {
  it('retries the original request after a successful /auth/refresh', async () => {
    let callCount = 0;
    server.use(
      http.get(`${API}/protected`, () => {
        callCount += 1;
        if (callCount === 1) return new HttpResponse(null, { status: 401 });
        return HttpResponse.json({ success: true, data: { id: 1 } });
      }),
      http.post(`${API}/auth/refresh`, () =>
        HttpResponse.json({ success: true }),
      ),
    );

    const res = await client.get('/protected');

    expect(callCount).toBe(2);
    expect(res.data).toEqual({ id: 1 });
  });

  it('calls onAuthFailure and rejects when /auth/refresh also fails', async () => {
    server.use(
      http.get(`${API}/protected`, () => new HttpResponse(null, { status: 401 })),
      http.post(`${API}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(client.get('/protected')).rejects.toThrow();

    expect(authFailureMock).toHaveBeenCalledOnce();
  });

  it('calls onAuthFailure immediately when the refresh call itself returns 401', async () => {
    server.use(
      http.post(`${API}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(client.post('/auth/refresh', {})).rejects.toThrow();

    expect(authFailureMock).toHaveBeenCalledOnce();
  });
});

describe('request interceptor — device headers', () => {
  it('attaches x-device-id and x-device-name on outgoing requests', async () => {
    let capturedHeaders: Record<string, string> = {};
    server.use(
      http.get(`${API}/test`, ({ request }) => {
        capturedHeaders = Object.fromEntries(request.headers.entries());
        return HttpResponse.json({ ok: true });
      }),
    );

    await client.get('/test');

    expect(capturedHeaders['x-device-id']).toBe('test-device-id');
    expect(capturedHeaders['x-device-name']).toBe('test-device-name');
  });

  it('omits device headers when skipDeviceHeaders is true', async () => {
    let capturedHeaders: Record<string, string> = {};
    server.use(
      http.get(`${API}/test`, ({ request }) => {
        capturedHeaders = Object.fromEntries(request.headers.entries());
        return HttpResponse.json({ ok: true });
      }),
    );

    await client.get('/test', { skipDeviceHeaders: true });

    expect(capturedHeaders['x-device-id']).toBeUndefined();
    expect(capturedHeaders['x-device-name']).toBeUndefined();
  });
});
