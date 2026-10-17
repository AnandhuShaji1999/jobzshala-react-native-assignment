import { checkOffline } from '@/lib/network';
import { MOCK_CONFIG } from './config';
import { createApiError, createNetworkError } from './errors';
import { handle } from './mockServer';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Stand-in for `fetch`. It behaves like a flaky network: fails fast when the device is offline,
 * otherwise waits 800-1500 ms and fails ~1 in 5 calls with a 500. Swapping in a real backend means
 * replacing only this function.
 */
export async function request<T>(method: 'GET' | 'POST', url: string): Promise<T> {
  if (await checkOffline()) throw createNetworkError();

  const { minDelayMs, maxDelayMs, failureRate } = MOCK_CONFIG;
  await sleep(minDelayMs + Math.random() * Math.max(0, maxDelayMs - minDelayMs));

  if (Math.random() < failureRate) throw createApiError(500, 'Internal Server Error');

  const response = handle(method, url);
  if (response.status >= 400) {
    const message = (response.body as { error?: string }).error ?? 'Request failed';
    throw createApiError(response.status, message);
  }
  return response.body as T;
}
