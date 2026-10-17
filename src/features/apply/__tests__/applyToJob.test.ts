import { createApiError, createNetworkError } from '@/api/errors';
import type { ApplyResponse } from '@/api/types';
import { selectIsApplied, useApplyStore } from '@/state/applyStore';
import { applyToJob, type ApplyDeps } from '../applyToJob';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => () => undefined),
    fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
  },
}));

const job = { id: 'job_1042', title: 'Heavy Truck Driver' };

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function makeDeps(post: ApplyDeps['post'], offline = false): ApplyDeps {
  return { post, isOffline: () => offline, getState: () => useApplyStore.getState() };
}

const isApplied = () => selectIsApplied(job.id)(useApplyStore.getState());

beforeEach(() => {
  useApplyStore.setState({ applied: {}, pending: {}, failures: {}, notice: null });
});

describe('applyToJob', () => {
  it('updates the UI optimistically before the server answers, then confirms', async () => {
    const request = deferred<ApplyResponse>();
    const post = jest.fn(() => request.promise);

    const outcome = applyToJob(job, makeDeps(post));

    // Request still in flight, but the job already reads as applied.
    expect(post).toHaveBeenCalledTimes(1);
    expect(isApplied()).toBe(true);
    expect(useApplyStore.getState().pending[job.id]).toBe(true);
    expect(useApplyStore.getState().applied[job.id]).toBeUndefined();

    request.resolve({ status: 'APPLIED' });
    await expect(outcome).resolves.toEqual({ status: 'applied' });

    expect(isApplied()).toBe(true);
    expect(useApplyStore.getState().pending[job.id]).toBeUndefined();
    expect(useApplyStore.getState().applied[job.id]).toEqual(expect.any(Number));
    expect(useApplyStore.getState().notice).toBeNull();
  });

  it('rolls back the optimistic update when the server returns a 500', async () => {
    const request = deferred<ApplyResponse>();
    const outcome = applyToJob(job, makeDeps(() => request.promise));
    expect(isApplied()).toBe(true);

    request.reject(createApiError(500, 'Internal Server Error'));
    await expect(outcome).resolves.toEqual({ status: 'failed', reason: 'server' });

    const state = useApplyStore.getState();
    expect(isApplied()).toBe(false);
    expect(state.pending[job.id]).toBeUndefined();
    expect(state.applied[job.id]).toBeUndefined();
    expect(state.failures[job.id]).toBe('server');
    expect(state.notice).toEqual({ jobId: job.id, jobTitle: job.title, reason: 'server' });
  });

  it('reports a dropped connection as offline and rolls back', async () => {
    const outcome = await applyToJob(job, makeDeps(() => Promise.reject(createNetworkError())));

    expect(outcome).toEqual({ status: 'failed', reason: 'offline' });
    expect(isApplied()).toBe(false);
    expect(useApplyStore.getState().failures[job.id]).toBe('offline');
  });

  it('refuses to apply while offline without touching state or calling the API', async () => {
    const post = jest.fn();
    const outcome = await applyToJob(job, makeDeps(post, true));

    expect(outcome).toEqual({ status: 'failed', reason: 'offline' });
    expect(post).not.toHaveBeenCalled();
    expect(isApplied()).toBe(false);
    expect(useApplyStore.getState().notice).toBeNull();
  });

  it('ignores a second tap while the first request is in flight', async () => {
    const request = deferred<ApplyResponse>();
    const post = jest.fn(() => request.promise);

    const first = applyToJob(job, makeDeps(post));
    const second = await applyToJob(job, makeDeps(post));

    expect(second).toEqual({ status: 'skipped' });
    expect(post).toHaveBeenCalledTimes(1);

    request.resolve({ status: 'APPLIED' });
    await first;
  });

  it('does not re-apply a job that is already applied', async () => {
    useApplyStore.setState({ applied: { [job.id]: 123 } });
    const post = jest.fn();

    await expect(applyToJob(job, makeDeps(post))).resolves.toEqual({ status: 'skipped' });
    expect(post).not.toHaveBeenCalled();
  });

  it('clears the previous failure and succeeds when retried', async () => {
    await applyToJob(job, makeDeps(() => Promise.reject(createApiError(500, 'boom'))));
    expect(useApplyStore.getState().failures[job.id]).toBe('server');

    const retry = await applyToJob(job, makeDeps(() => Promise.resolve({ status: 'APPLIED' as const })));

    expect(retry).toEqual({ status: 'applied' });
    expect(useApplyStore.getState().failures[job.id]).toBeUndefined();
    expect(useApplyStore.getState().notice).toBeNull();
    expect(useApplyStore.getState().applied[job.id]).toEqual(expect.any(Number));
  });

  it('only persists confirmed applications, never in-flight or failed ones', async () => {
    const request = deferred<ApplyResponse>();
    const outcome = applyToJob(job, makeDeps(() => request.promise));

    const persistOptions = useApplyStore.persist.getOptions();
    const snapshot = persistOptions.partialize?.(useApplyStore.getState());
    expect(snapshot).toEqual({ applied: {} }); // pending is not saved

    request.resolve({ status: 'APPLIED' });
    await outcome;
    expect(persistOptions.partialize?.(useApplyStore.getState())).toEqual({
      applied: { [job.id]: expect.any(Number) },
    });
  });
});
