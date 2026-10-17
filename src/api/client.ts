import { request } from './transport';
import type { ApplyResponse, CountryFilter, Job, MatchesPage } from './types';

export const jobsApi = {
  getMatches(country: CountryFilter, page: number): Promise<MatchesPage> {
    const params = country === 'All' ? [] : [`country=${encodeURIComponent(country)}`];
    params.push(`page=${page}`);
    return request<MatchesPage>('GET', `/jobs/matches?${params.join('&')}`);
  },

  getJob(id: string): Promise<Job> {
    return request<Job>('GET', `/jobs/${encodeURIComponent(id)}`);
  },

  apply(id: string): Promise<ApplyResponse> {
    return request<ApplyResponse>('POST', `/jobs/${encodeURIComponent(id)}/apply`);
  },
};
