export type Country = 'UAE' | 'Saudi Arabia' | 'Qatar';
export type CountryFilter = 'All' | Country;

export const COUNTRIES: readonly Country[] = ['UAE', 'Saudi Arabia', 'Qatar'];
export const COUNTRY_FILTERS: readonly CountryFilter[] = ['All', ...COUNTRIES];

export interface Benefits {
  accommodation: boolean;
  food: boolean;
  visa: boolean;
}

export interface Job {
  id: string;
  title: string;
  /** Intentionally generic, e.g. "Logistics company, UAE". No employer identity or contact fields. */
  employer_display: string;
  country: Country;
  city: string;
  salary_min_aed: number;
  salary_max_aed: number;
  match_score: number;
  match_reason: string;
  skills: string[];
  benefits: Benefits;
  description: string;
  requirements: string[];
  posted_at: string;
}

export interface MatchesPage {
  items: Job[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}

export interface ApplyResponse {
  status: 'APPLIED';
}
