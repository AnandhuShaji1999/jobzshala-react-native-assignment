import { jobsApi } from '@/api/client';
import { isNetworkError } from '@/api/errors';
import type { ApplyResponse, Job } from '@/api/types';
import { getIsOffline } from '@/lib/network';
import { useApplyStore, type ApplyFailureReason, type ApplyState } from '@/state/applyStore';

export type ApplyOutcome =
  | { status: 'applied' }
  | { status: 'skipped' } // already applied or in flight
  | { status: 'failed'; reason: ApplyFailureReason };

export interface ApplyDeps {
  post: (jobId: string) => Promise<ApplyResponse>;
  isOffline: () => boolean;
  getState: () => ApplyState;
}

const defaultDeps: ApplyDeps = {
  post: (jobId) => jobsApi.apply(jobId),
  isOffline: getIsOffline,
  getState: () => useApplyStore.getState(),
};

/**
 * Optimistic apply:
 *  1. mark the job applied immediately (UI updates before the network answers)
 *  2. call the API
 *  3. on success, confirm; on any failure, roll the optimistic state back and record why
 *
 * Offline is rejected up front without touching state, so nothing needs rolling back.
 * Dependencies are injectable so the logic can be unit tested without React or a network.
 */
export async function applyToJob(
  job: Pick<Job, 'id' | 'title'>,
  deps: ApplyDeps = defaultDeps,
): Promise<ApplyOutcome> {
  if (deps.isOffline()) return { status: 'failed', reason: 'offline' };

  const store = deps.getState();
  if (!store.begin(job.id)) return { status: 'skipped' };

  try {
    await deps.post(job.id);
    deps.getState().commit(job.id);
    return { status: 'applied' };
  } catch (error) {
    const reason: ApplyFailureReason = isNetworkError(error) ? 'offline' : 'server';
    deps.getState().rollback(job, reason);
    return { status: 'failed', reason };
  }
}
