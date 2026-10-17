# Jobzshala — Job Matches (React Native take-home)

A small "Job Matches" flow for the Jobzshala candidate app: a ranked list of AI-matched jobs, a job detail screen, and an optimistic Apply flow. Built with Expo SDK 58, React Native 0.88 and TypeScript (strict), against a mock API that behaves like a flaky real network.

Built for the user described in the brief: a budget Android phone (2–3 GB RAM), patchy 4G, possibly Hindi-first.

## Run it

```bash
npm install
npx expo start        # press "a" for an Android emulator, or scan the QR with Expo Go (SDK 58)
```

Other scripts:

```bash
npm run typecheck     # tsc --noEmit (strict)
npm test              # unit tests (apply logic + mock server)
```

### Demo switches for the mock network

Defaults follow the brief (800–1500 ms delay, ~1 in 5 calls fail with a 500). To demo a specific path deterministically:

```bash
EXPO_PUBLIC_MOCK_FAILURE_RATE=1 npx expo start    # every call fails -> error states, apply rollback
EXPO_PUBLIC_MOCK_FAILURE_RATE=0 npx expo start    # never fails -> clean happy path
EXPO_PUBLIC_MOCK_MIN_DELAY_MS=100 EXPO_PUBLIC_MOCK_MAX_DELAY_MS=200 npx expo start   # fast
```

To see the offline path, switch the device/emulator to airplane mode.

## What's in it

| Requirement | Where |
| --- | --- |
| Job Matches list: card fields, sorted by score, country filter, pull-to-refresh | `src/app/index.tsx`, `src/components/JobCard.tsx`, `CountryFilterBar.tsx` |
| Loading, empty, error (Retry), offline-without-cache states | `src/components/StateViews.tsx` |
| Job Detail with sticky Apply, benefits, match reason | `src/app/job/[id].tsx` |
| Optimistic apply, confirmation, rollback + clear error | `src/features/apply/applyToJob.ts`, `src/app/applied/[id].tsx`, `src/components/Snackbar.tsx` |
| Applied state survives restart | `src/state/applyStore.ts` (persisted) |
| EN / हिन्दी toggle for all UI labels | `src/i18n/`, `src/components/LanguageToggle.tsx` |
| Offline banner + cached list, Apply disabled with reason | `src/components/OfflineBanner.tsx`, `src/state/queryClient.ts` |
| Mock API (200 jobs, paginated, delay, 5xx) | `src/api/` |
| Bonus: infinite scroll via the paginated endpoint | `src/hooks/useMatches.ts` |
| Bonus: unit tests for optimistic update and rollback | `src/features/apply/__tests__/` |
| Bonus: accessibility basics (labels, 48 dp targets) | throughout; `MIN_TOUCH` in `src/theme.ts` |

Not attempted: the voice-note bonus. I preferred to spend the time on the real-world states, which carry more weight.

## Structure

```
src/
  api/        types, mock dataset, REST-style mock server, flaky transport, typed client
  state/      persisted apply store, persisted language store, query client + cache persistence
  features/   apply/applyToJob.ts — the optimistic-apply use case (pure, injectable, tested)
  hooks/      useMatches (infinite list + refresh), useJob (detail)
  i18n/       strings (en/hi, type-checked for key parity), t(), number formatting
  components/ presentational pieces; no data fetching inside them except per-card applied flag
  app/        expo-router screens (thin: compose hooks + components)
```

The layering is deliberate: **screens → hooks/features → api client → transport**. Swapping the mock for a real backend means rewriting only `src/api/transport.ts` (it is the one place that stands in for `fetch`); the client, server contract, hooks and UI do not change.

## Library choices and why

- **Expo Router** — file-based routes, typed params, deep links for free, and it is the Expo-recommended path in SDK 58. Cost: one more abstraction than raw React Navigation.
- **TanStack Query (+ async-storage persister)** — caching, pagination (`useInfiniteQuery`), retry, and offline pausing are exactly this app's problems, and writing them by hand is where bugs live. The persister is what makes "last cached list while offline" work after a cold start.
- **Zustand (+ persist)** — two tiny pieces of client state (applied jobs, language). Selector subscriptions mean a card only re-renders when *its* applied flag changes; Context would re-render every card.
- **@shopify/flash-list** — cell recycling for the 200-item scroll requirement on 2–3 GB devices. JS-only in v2, so it works in Expo Go. It is a list primitive, not a UI kit; all components and styling are my own.
- **@react-native-community/netinfo** — one offline signal shared by the banner, the Apply button, the mock transport and React Query's `onlineManager`.
- **No i18n library, no UI kit, no icon pack** — two languages and ~80 strings don't justify i18next; glyphs (✓ ✗ 📡) avoid shipping an icon font.

## How the tricky parts work

- **Optimistic apply.** `applyToJob()` flips the job to `pending` synchronously on tap (the list tag and confirmation screen are correct before the network replies), calls the API, then `commit`s or `rollback`s. A failure removes the optimistic state and records *why* (server vs. offline). If the user is on the confirmation screen they see a full error with Try again; if they've already navigated away, a snackbar says the application was undone, so a "Applied" tag never just silently disappears.
- **Persistence.** Only *confirmed* applications are persisted. Pending and failed state is session-only.
- **Offline.** `NetInfo` drives a banner under the header on every screen. React Query pauses fetches offline and keeps showing persisted data (7-day cache). Apply is disabled with the reason shown next to it; `applyToJob` also refuses offline up front, so nothing needs rolling back.
- **Detail screen.** It opens instantly from list data already in the cache (and works offline), then refreshes in the background. A failed background refresh never replaces content with an error screen.
- **Pagination + refresh.** 20 per page, sorted globally by score on the "server" so pages never reshuffle. Pull-to-refresh fetches **page 1 only** and replaces the cache with it; calling `refetch()` would re-request every loaded page one after another and one flaky page would fail the lot. If a refresh fails, the existing list stays and a dismissible Retry strip appears. A failed "load more" shows an inline Retry instead of re-firing on every scroll.
- **Performance on low-end devices.** FlashList recycling; `JobCard` is `memo`'d with a stable `onPress` and an immutable `job` prop; the applied flag is a primitive selector; skeleton pulses via one native-driven animated node; system font scaling is capped at 1.3× so large-font users don't break layouts.
- **Hindi.** All UI labels switch instantly and persist. Line heights are ~1.45× font size because Devanagari clips at tighter values, and nothing has a fixed height or width, so longer Hindi strings wrap rather than break. Job content from the API stays English as specified; country names are localised because the filter needs them anyway.
- **Employer privacy.** The data shape has no employer name or contact fields, only the generic `employer_display`. A test asserts it.

## Trade-offs I made

1. **List payload carries full job objects** (as in the sample shape), which is what lets detail open instantly and offline. A real API would probably return a slimmer summary; then the detail screen's persisted-cache fallback becomes the offline story, and first-time offline detail views would need a "not saved" state (the component already has one).
2. **An apply interrupted by killing the app is treated as "not applied" on restart.** The honest fix is an outbox with an idempotency key and retry on reconnect; that is the first thing I'd build next. The mock server's apply is idempotent so that design drops in cleanly.
3. **Whole query cache is serialised to AsyncStorage.** Fine for ~200 jobs (low hundreds of KB). It would not scale to thousands; I'd move to MMKV or SQLite.
4. **Offline detection uses `isInternetReachable`.** On captive-portal networks the device can look online while requests fail; those failures are handled by the normal error paths rather than the offline banner.
5. **Language defaults to English** instead of the device locale, and is a one-tap toggle in the header. I wanted the toggle to be the single obvious control; a first-run language prompt would suit this audience better.
6. **Hindi copy was written by me and has not been reviewed by a native speaker.** It should be reviewed before shipping, especially the apply-failure messages.
7. **Basic accessibility, not audited.** Labels, roles, live regions and 48 dp targets are in place, but I have not run a TalkBack pass.
8. **Plain system fonts and emoji glyphs** instead of a brand font/icon set, to keep the bundle small and avoid font-loading states.

## With another day

- Apply **outbox**: persist pending applications with an idempotency key, retry on reconnect, surface "Sending…" state.
- Component tests (React Native Testing Library) for the list/empty/error/offline states, and Maestro flows for offline + rollback.
- Test on a real 2 GB Android device with the Perf Monitor; tune `drawDistance` and page size from numbers rather than guesses.
- Native-speaker Hindi review, plus a TalkBack pass.
- Shimmer skeleton, relative "posted 3 days ago" using `posted_at` (it's in the data, not yet shown), scroll-position restore when returning from detail.
- Voice-note bonus (record, playback, then submit).
- Move the cache to MMKV/SQLite; add a hidden dev panel to flip failure rate and offline at runtime.

## Verification

Automated: `npm run typecheck` is clean under `strict` (plus `noUncheckedIndexedAccess`), 13 unit tests pass (optimistic update, rollback on 500, rollback on network drop, offline guard, double-tap guard, retry after failure, persistence scope, pagination/sorting/filter/404 on the mock server), and `expo export --platform android` produces a Hermes bundle. A fresh clone installs with `npm ci`.
