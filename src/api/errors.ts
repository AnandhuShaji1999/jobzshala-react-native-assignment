/**
 * Errors carry a `kind` discriminant instead of relying on `instanceof`,
 * which is fragile across transpiled Error subclasses.
 */
export interface ApiError extends Error {
  kind: 'api';
  status: number;
}

export interface NetworkError extends Error {
  kind: 'network';
}

export function createApiError(status: number, message: string): ApiError {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.kind = 'api';
  error.status = status;
  return error;
}

export function createNetworkError(message = 'Network request failed'): NetworkError {
  const error = new Error(message) as NetworkError;
  error.name = 'NetworkError';
  error.kind = 'network';
  return error;
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof Error && (e as Partial<ApiError>).kind === 'api';
}

export function isNetworkError(e: unknown): e is NetworkError {
  return e instanceof Error && (e as Partial<NetworkError>).kind === 'network';
}
