import { MOCK_CONFIG } from './config';
import { getAllJobs } from './mockData';
import { COUNTRIES, type ApplyResponse, type Country, type Job, type MatchesPage } from './types';

export interface MockResponse {
  status: number;
  body: unknown;
}

/** Server-side record of applications. Lives in memory only; the app's own store is the source of truth for the UI. */
const appliedOnServer = new Set<string>();

function parseQuery(query: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (query === '') return out;
  for (const pair of query.split('&')) {
    const [rawKey = '', rawValue = ''] = pair.split('=');
    out[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);
  }
  return out;
}

function isCountry(value: string): value is Country {
  return (COUNTRIES as readonly string[]).includes(value);
}

function listMatches(query: Record<string, string>): MockResponse {
  const countryParam = query.country;
  let jobs: Job[] = getAllJobs();

  if (countryParam !== undefined && countryParam !== '' && countryParam !== 'All') {
    if (!isCountry(countryParam)) return { status: 400, body: { error: 'Unknown country' } };
    jobs = jobs.filter((job) => job.country === countryParam);
  }

  const page = query.page === undefined ? 1 : Number(query.page);
  if (!Number.isInteger(page) || page < 1) return { status: 400, body: { error: 'Invalid page' } };

  const start = (page - 1) * MOCK_CONFIG.pageSize;
  const body: MatchesPage = {
    items: jobs.slice(start, start + MOCK_CONFIG.pageSize),
    page,
    page_size: MOCK_CONFIG.pageSize,
    total: jobs.length,
    has_more: start + MOCK_CONFIG.pageSize < jobs.length,
  };
  return { status: 200, body };
}

/** Routes the three endpoints from the brief. Pure: delay and failure injection live in the transport. */
export function handle(method: string, url: string): MockResponse {
  const [path = '', query = ''] = url.split('?');

  if (method === 'GET' && path === '/jobs/matches') return listMatches(parseQuery(query));

  const jobMatch = /^\/jobs\/([^/]+)$/.exec(path);
  if (method === 'GET' && jobMatch) {
    const job = getAllJobs().find((j) => j.id === jobMatch[1]);
    return job ? { status: 200, body: job } : { status: 404, body: { error: 'Job not found' } };
  }

  const applyMatch = /^\/jobs\/([^/]+)\/apply$/.exec(path);
  if (method === 'POST' && applyMatch) {
    const id = applyMatch[1] as string;
    if (!getAllJobs().some((j) => j.id === id)) return { status: 404, body: { error: 'Job not found' } };
    appliedOnServer.add(id); // idempotent
    const body: ApplyResponse = { status: 'APPLIED' };
    return { status: 200, body };
  }

  return { status: 404, body: { error: 'Not found' } };
}
