import * as SecureStore from '@/shared/secureStorage';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
  const cached = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (cached) return cached;

  const id = globalThis.crypto?.randomUUID?.() ?? `web-${Date.now()}`;
  await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  return id;
}

export function getDeviceName(): string {
  return navigator.userAgent.slice(0, 64);
}
