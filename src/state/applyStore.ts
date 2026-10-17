import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ApplyFailureReason = 'offline' | 'server';

export interface ApplyNotice {
  jobId: string;
  jobTitle: string;
  reason: ApplyFailureReason;
}

export interface ApplyState {
  /** Confirmed applications (jobId -> timestamp). The only slice that is persisted. */
  applied: Record<string, number>;
  /** In-flight applications. The UI already treats these as "Applied" (optimistic). */
  pending: Record<string, true>;
  /** Last failure per job, used by the confirmation screen to show a clear error. */
  failures: Record<string, ApplyFailureReason>;
  /** Transient message for the global snackbar when a rollback happens off the confirmation screen. */
  notice: ApplyNotice | null;

  /** Optimistically marks a job applied. Returns false if it already is (or is in flight). */
  begin: (jobId: string) => boolean;
  /** Server confirmed: promote pending -> applied. */
  commit: (jobId: string) => void;
  /** Server/network failed: undo the optimistic update and record why. */
  rollback: (job: { id: string; title: string }, reason: ApplyFailureReason) => void;
  clearFailure: (jobId: string) => void;
  dismissNotice: () => void;
}

export const useApplyStore = create<ApplyState>()(
  persist(
    (set, get) => ({
      applied: {},
      pending: {},
      failures: {},
      notice: null,

      begin: (jobId) => {
        const { applied, pending, failures } = get();
        if (applied[jobId] !== undefined || pending[jobId]) return false;
        const { [jobId]: _cleared, ...restFailures } = failures;
        set({ pending: { ...pending, [jobId]: true }, failures: restFailures, notice: null });
        return true;
      },

      commit: (jobId) => {
        const { applied, pending } = get();
        const { [jobId]: _done, ...restPending } = pending;
        set({ pending: restPending, applied: { ...applied, [jobId]: Date.now() } });
      },

      rollback: (job, reason) => {
        const { pending, failures } = get();
        const { [job.id]: _undone, ...restPending } = pending;
        set({
          pending: restPending,
          failures: { ...failures, [job.id]: reason },
          notice: { jobId: job.id, jobTitle: job.title, reason },
        });
      },

      clearFailure: (jobId) => {
        const { failures } = get();
        if (failures[jobId] === undefined) return;
        const { [jobId]: _gone, ...rest } = failures;
        set({ failures: rest });
      },

      dismissNotice: () => set({ notice: null }),
    }),
    {
      name: 'jobzshala-applied',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Pending/failures/notice are session-only. An app killed mid-request restarts as "not applied".
      partialize: (state) => ({ applied: state.applied }),
    },
  ),
);

/** Boolean selector: true for confirmed and in-flight (optimistic) applications. */
export const selectIsApplied = (jobId: string) => (state: ApplyState) =>
  state.applied[jobId] !== undefined || state.pending[jobId] === true;

export const selectIsPending = (jobId: string) => (state: ApplyState) => state.pending[jobId] === true;
