# Jobzshala — Job Matches

A React Native take-home assignment for Jobzshala. This application provides a Job Matches experience with ranked job listings, job details, country filtering, English/Hindi language switching, offline support, and an optimistic Apply flow.

The app uses Expo, React Native, TypeScript, and a mock API that simulates network delays and failures.

## Features

- **Job Matches list:** Displays ranked job recommendations with relevant job information.
- **Country filter:** Filter jobs by country.
- **Pull to refresh:** Refresh the job list.
- **Infinite scrolling:** Load additional jobs through pagination.
- **Job details:** View job information, benefits, and match reasons.
- **Apply flow:** Apply optimistically, show confirmation, and roll back the state when an application fails.
- **Persistent applied state:** Confirmed applications are preserved across app restarts.
- **English and Hindi:** Switch between English and Hindi UI labels.
- **Offline support:** Display cached job listings and an offline indicator.
- **Loading and error states:** Handle loading, empty results, request failures, and retry actions.
- **Mock network:** Simulate API delays and server failures.
- **Accessibility basics:** Include accessible labels and appropriately sized touch targets.

## Tech Stack

- React Native
- Expo SDK 57
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- AsyncStorage
- Shopify FlashList
- React Native NetInfo
- Jest and Jest Expo

The exact dependency versions are defined in `package.json`.

## Requirements

Before running the project, install:

- Node.js (a version compatible with the installed Expo SDK)
- npm
- Expo Go compatible with the project's Expo SDK, or an Android emulator
- Git (optional, for cloning the repository)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnandhuShaji1999/jobzshala-react-native-assignment.git
cd jobzshala-react-native-assignment
```

### 2. Install dependencies

```bash
npm install
```

If you are installing from a committed lockfile and want a reproducible installation, you can use:

```bash
npm ci
```

### 3. Start the development server

```bash
npx expo start
```

To run on an Android emulator, press `a` in the terminal if the emulator is available.

To run on a physical Android device, open Expo Go and scan the QR code. Use an Expo Go version compatible with the project's SDK.

## Available Scripts

```bash
npm run typecheck
npm test
```

- `npm run typecheck` checks TypeScript types, if the script is configured in `package.json`.
- `npm test` runs the configured test suite, if the script is configured in `package.json`.

## Mock API and Network Simulation

The mock API simulates a real network by introducing request delays and occasional failures.

The intended default behavior is:

- Approximately 200 jobs.
- Pagination with 20 jobs per page.
- Simulated network delay of approximately 800–1500 ms.
- Occasional server errors.

The actual behavior is controlled by the mock API implementation in `src/api/`.

### Demoing successful requests

In Windows PowerShell, run:

```powershell
$env:EXPO_PUBLIC_MOCK_FAILURE_RATE="0"
npx expo start
```

### Demoing failed requests

```powershell
$env:EXPO_PUBLIC_MOCK_FAILURE_RATE="1"
npx expo start
```

### Demoing faster requests

```powershell
$env:EXPO_PUBLIC_MOCK_MIN_DELAY_MS="100"
$env:EXPO_PUBLIC_MOCK_MAX_DELAY_MS="200"
npx expo start
```

These environment variables work only if they are supported by the mock API implementation. Restart Expo after changing them.

To demonstrate offline behavior, disable Wi-Fi and mobile data on the device or emulator.

## Project Structure

```text
src/
├── api/          API types, mock dataset, mock server and transport
├── app/          Expo Router screens
├── components/   Reusable UI components
├── features/     Feature-specific business logic
├── hooks/        Data fetching and reusable hooks
├── i18n/         English and Hindi translations
└── state/        Application state and caching
```

The main architectural flow is:

```text
Screens
   ↓
Hooks and feature logic
   ↓
API client
   ↓
Mock transport
```

This separation keeps UI components independent of the underlying transport and makes it easier to replace the mock API with a real backend.

## Library Choices

### Expo Router

Provides file-based navigation and keeps screen organization simple.

### TanStack Query

Handles server-state caching, pagination, refreshing, and request lifecycle management. Persisted caching supports displaying previously loaded data when offline.

### Zustand

Manages lightweight client-side state, including applied jobs and language preferences.

### Shopify FlashList

Provides an efficient list implementation for rendering many job cards.

### React Native NetInfo

Provides network connectivity information used by the offline UI and request handling.

### AsyncStorage

Persists supported application state and cached data between app sessions.

### TypeScript

Provides static typing for application data, navigation-related code, and business logic.

## Important Implementation Details

### Optimistic Apply

The application updates the UI immediately when the user taps Apply. If the request succeeds, the application is confirmed. If it fails, the optimistic state is rolled back and the user receives an appropriate error message.

### Offline Handling

The app uses network connectivity information and cached query data to support offline access to previously loaded jobs. Applying for a job is disabled or rejected while offline, according to the implemented flow.

### Pagination and Refresh

The job list loads results in pages and supports additional loading while scrolling. Pull-to-refresh allows users to request updated results.

### Language Switching

Users can switch between English and Hindi. UI translations are maintained in the internationalization files.

### Persistence

The application uses persistent storage for supported client state and cached data. Pending or failed application state should not be treated as a confirmed application.

## Testing and Verification

Before submitting, verify the following commands from the project directory:

```bash
npm run typecheck
npm test
npx expo-doctor
```

You can also check whether the Android export succeeds:

```bash
npx expo export --platform android
```

Only report test counts or successful build/export results after confirming them in your local environment.

## Known Trade-offs

- The app uses a mock API instead of a production backend.
- Offline access depends on data that has already been cached.
- An application interrupted by terminating the app may require a more robust retry/outbox mechanism.
- The persisted query cache is suitable for the assignment's dataset but may need a different storage strategy at larger scale.
- Hindi translations should be reviewed by a native speaker before production use.
- Accessibility should be validated with assistive technologies such as TalkBack.

## Future Improvements

- Integrate a production backend.
- Add a persistent application outbox with safe retries.
- Expand component and end-to-end test coverage.
- Perform accessibility testing with TalkBack.
- Review Hindi translations with a native speaker.
- Profile performance on low-end Android devices.
- Improve caching and storage for larger datasets.

## Assignment Submission

**Project:** Jobzshala — Job Matches  
**Repository:** https://github.com/AnandhuShaji1999/jobzshala-react-native-assignment

Built as a React Native take-home assignment for Jobzshala.
