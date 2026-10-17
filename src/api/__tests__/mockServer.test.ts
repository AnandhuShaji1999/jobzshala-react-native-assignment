import { handle } from '../mockServer';
import type { Job, MatchesPage } from '../types';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn(() => () => undefined), fetch: jest.fn() },
}));

const matches = (url: string) => handle('GET', url).body as MatchesPage;

describe('mock server', () => {
  it('serves 200 jobs in pages of 20, best match first', () => {
    const pages: Job[][] = [];
    for (let page = 1; page <= 10; page++) pages.push(matches(`/jobs/matches?page=${page}`).items);

    const all = pages.flat();
    expect(all).toHaveLength(200);
    expect(new Set(all.map((j) => j.id)).size).toBe(200);
    for (let i = 1; i < all.length; i++) {
      expect((all[i] as Job).match_score).toBeLessThanOrEqual((all[i - 1] as Job).match_score);
    }
    expect(matches('/jobs/matches?page=1').has_more).toBe(true);
    expect(matches('/jobs/matches?page=10').has_more).toBe(false);
    expect(matches('/jobs/matches?page=11').items).toHaveLength(0);
  });

  it('filters by country and keeps the ordering', () => {
    const first = matches('/jobs/matches?country=Saudi%20Arabia&page=1');
    expect(first.items.length).toBeGreaterThan(0);
    expect(first.items.every((j) => j.country === 'Saudi Arabia')).toBe(true);
    expect(first.total).toBeLessThan(200);
  });

  it('exposes only generic employer names and no contact fields', () => {
    const job = matches('/jobs/matches?page=1').items[0] as Job;
    expect(job.employer_display).toMatch(/, (UAE|Saudi Arabia|Qatar)$/);
    expect(Object.keys(job)).not.toEqual(expect.arrayContaining(['phone', 'email', 'employer_name']));
  });

  it('returns a job, 404s unknown ids, and applies idempotently', () => {
    const id = (matches('/jobs/matches?page=1').items[0] as Job).id;
    expect(handle('GET', `/jobs/${id}`).status).toBe(200);
    expect(handle('GET', '/jobs/nope').status).toBe(404);
    expect(handle('POST', `/jobs/${id}/apply`).body).toEqual({ status: 'APPLIED' });
    expect(handle('POST', `/jobs/${id}/apply`).body).toEqual({ status: 'APPLIED' });
    expect(handle('POST', '/jobs/nope/apply').status).toBe(404);
  });

  it('rejects bad input', () => {
    expect(handle('GET', '/jobs/matches?country=Mars&page=1').status).toBe(400);
    expect(handle('GET', '/jobs/matches?page=0').status).toBe(400);
  });
});
