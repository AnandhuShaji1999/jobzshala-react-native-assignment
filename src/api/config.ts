function readNumber(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Mock network behaviour. Defaults follow the brief (800-1500 ms, ~1 in 5 calls fail).
 * Override for demos, e.g. `EXPO_PUBLIC_MOCK_FAILURE_RATE=1 npx expo start` to force errors,
 * or `0` to force success.
 */
export const MOCK_CONFIG = {
  minDelayMs: readNumber(process.env.EXPO_PUBLIC_MOCK_MIN_DELAY_MS, 800),
  maxDelayMs: readNumber(process.env.EXPO_PUBLIC_MOCK_MAX_DELAY_MS, 1500),
  failureRate: readNumber(process.env.EXPO_PUBLIC_MOCK_FAILURE_RATE, 0.2),
  pageSize: 20,
  jobCount: 200,
} as const;
