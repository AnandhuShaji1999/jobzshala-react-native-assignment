import { MOCK_CONFIG } from './config';
import type { Country, Job } from './types';

/** Small seeded PRNG so the dataset (and job ids) are identical on every launch. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface RoleTemplate {
  title: string;
  industries: string[];
  salary: [number, number];
  experience: string;
  credentials: string[];
  skills: string[];
  requirements: string[];
  description: string;
}

const ROLES: RoleTemplate[] = [
  {
    title: 'Heavy Truck Driver',
    industries: ['Logistics company', 'Construction company', 'Freight forwarder'],
    salary: [2800, 3500],
    experience: 'heavy vehicle',
    credentials: ['a valid GCC licence', 'a heavy vehicle licence'],
    skills: ['Heavy vehicle', 'GCC licence', 'Route planning', 'Load securing', 'Vehicle inspection'],
    requirements: ['Valid GCC heavy licence', 'Clean driving record', 'Able to work night shifts'],
    description: 'Drive 18-wheelers on inter-city routes. You will own pre-trip checks, safe loading and on-time delivery.',
  },
  {
    title: 'Light Vehicle Driver',
    industries: ['Facilities management company', 'Hospitality group', 'Car rental company'],
    salary: [1800, 2400],
    experience: 'light vehicle driving',
    credentials: ['a valid UAE or GCC licence', 'a clean driving record'],
    skills: ['Light vehicle', 'City navigation', 'Customer service', 'Time keeping'],
    requirements: ['Valid light vehicle licence', 'Good knowledge of city roads', 'Polite and punctual'],
    description: 'Transport staff and guests between sites. Keep the vehicle clean, log trips and report faults early.',
  },
  {
    title: 'Industrial Electrician',
    industries: ['Construction company', 'Manufacturing company', 'Facilities management company'],
    salary: [2600, 3600],
    experience: 'industrial wiring',
    credentials: ['an ITI electrician certificate', 'a trade test certificate'],
    skills: ['Wiring', 'Panel work', 'Fault finding', 'Conduit installation', 'Safety standards'],
    requirements: ['ITI or equivalent electrician certificate', 'Can read single-line diagrams', 'Own basic hand tools'],
    description: 'Install and maintain wiring, panels and lighting at active sites. Follow lockout-tagout and site safety rules.',
  },
  {
    title: 'Welder (MIG/TIG)',
    industries: ['Oil & gas services company', 'Manufacturing company', 'Construction company'],
    salary: [2400, 3800],
    experience: 'MIG and TIG welding',
    credentials: ['a 6G welding test', 'a recognised welder certificate'],
    skills: ['MIG welding', 'TIG welding', 'Blueprint reading', 'Grinding', 'Fabrication'],
    requirements: ['Recognised welding certificate', 'Able to weld stainless steel and carbon steel', 'Comfortable working at height'],
    description: 'Weld pipes and structural steel to drawings. Quality checks and weld logs are part of the job.',
  },
  {
    title: 'Retail Sales Associate',
    industries: ['Retail chain', 'Supermarket chain', 'Fashion retailer'],
    salary: [1500, 2200],
    experience: 'retail floor',
    credentials: ['good spoken English', 'basic Hindi and Arabic'],
    skills: ['Customer service', 'Cash handling', 'Stock display', 'Basic English'],
    requirements: ['Basic spoken English', 'Friendly with customers', 'Can stand for long shifts'],
    description: 'Help shoppers, keep shelves full and handle billing. Rotating shifts including weekends.',
  },
  {
    title: 'Cashier',
    industries: ['Supermarket chain', 'Retail chain', 'Pharmacy chain'],
    salary: [1400, 2000],
    experience: 'POS and billing',
    credentials: ['basic English', 'quick and accurate cash counting'],
    skills: ['POS system', 'Cash handling', 'Accuracy', 'Basic English'],
    requirements: ['Previous cashier experience preferred', 'Honest and accurate', 'Basic English'],
    description: 'Run the billing counter, count cash at end of shift and keep the checkout area tidy.',
  },
  {
    title: 'Forklift Operator',
    industries: ['Logistics company', 'Warehouse operator', 'Manufacturing company'],
    salary: [1900, 2600],
    experience: 'forklift operation',
    credentials: ['a valid forklift licence', 'warehouse safety training'],
    skills: ['Forklift', 'Warehouse safety', 'Pallet racking', 'Inventory scanning'],
    requirements: ['Valid forklift operator licence', 'Safety-first attitude', 'Can lift and handle goods'],
    description: 'Move pallets between racks and trucks. Keep aisles clear and report damaged stock.',
  },
  {
    title: 'HVAC Technician',
    industries: ['Facilities management company', 'Real estate developer', 'Hospitality group'],
    salary: [2400, 3300],
    experience: 'AC installation and repair',
    credentials: ['an HVAC diploma', 'refrigerant handling training'],
    skills: ['AC repair', 'Refrigerant handling', 'Duct work', 'Preventive maintenance'],
    requirements: ['HVAC diploma or equivalent', 'Experience with split and package units', 'Own basic tools'],
    description: 'Service and repair air-conditioning across residential and commercial buildings.',
  },
  {
    title: 'Plumber',
    industries: ['Facilities management company', 'Construction company', 'Real estate developer'],
    salary: [2000, 2900],
    experience: 'plumbing',
    credentials: ['a plumbing trade certificate', 'pipe fitting training'],
    skills: ['Pipe fitting', 'Leak repair', 'Drainage', 'Water heater service'],
    requirements: ['Plumbing trade certificate', 'Can read plumbing drawings', 'Physically fit'],
    description: 'Install and repair pipes, fixtures and drainage in buildings under maintenance contracts.',
  },
  {
    title: 'Security Guard',
    industries: ['Security services company', 'Facilities management company', 'Retail chain'],
    salary: [1500, 2100],
    experience: 'security duty',
    credentials: ['basic security training', 'a clean police record'],
    skills: ['Patrolling', 'Access control', 'Report writing', 'Basic English'],
    requirements: ['Height and fitness requirements apply', 'Basic English', 'Clean police clearance'],
    description: 'Guard entry points, check visitors and log incidents. Day and night rotation.',
  },
  {
    title: 'Warehouse Helper',
    industries: ['Logistics company', 'Warehouse operator', 'E-commerce company'],
    salary: [1300, 1800],
    experience: 'warehouse',
    credentials: ['a good attendance record', 'physical fitness'],
    skills: ['Loading', 'Packing', 'Inventory scanning', 'Teamwork'],
    requirements: ['Able to lift 25 kg repeatedly', 'Willing to work overtime', 'No experience needed for entry level'],
    description: 'Pick, pack and load orders. Keep the work area clean and follow safety instructions.',
  },
  {
    title: 'Mason',
    industries: ['Construction company', 'Real estate developer'],
    salary: [1800, 2600],
    experience: 'block and brick work',
    credentials: ['a trade test certificate', 'site safety training'],
    skills: ['Block work', 'Plastering', 'Concrete finishing', 'Measuring'],
    requirements: ['Previous site experience', 'Can work from drawings', 'Comfortable working outdoors'],
    description: 'Build walls, finish surfaces and work with the site team to meet daily progress targets.',
  },
  {
    title: 'Painter',
    industries: ['Construction company', 'Facilities management company', 'Real estate developer'],
    salary: [1600, 2300],
    experience: 'interior and exterior painting',
    credentials: ['a painting trade certificate', 'spray painting experience'],
    skills: ['Surface preparation', 'Spray painting', 'Colour matching', 'Putty work'],
    requirements: ['Experience with emulsion and enamel', 'Neat finishing', 'Can work at height'],
    description: 'Prepare and paint walls, ceilings and metal surfaces to a high finish.',
  },
  {
    title: 'CNC Machine Operator',
    industries: ['Manufacturing company', 'Oil & gas services company'],
    salary: [2300, 3200],
    experience: 'CNC machine',
    credentials: ['an ITI machinist certificate', 'CNC setup training'],
    skills: ['CNC operation', 'Tool setup', 'Measuring tools', 'Blueprint reading'],
    requirements: ['ITI machinist or equivalent', 'Can use vernier and micrometer', 'Basic G-code knowledge'],
    description: 'Set up and run CNC machines to produce parts within tolerance. Report tool wear and defects.',
  },
  {
    title: 'Scaffolder',
    industries: ['Construction company', 'Oil & gas services company'],
    salary: [1900, 2800],
    experience: 'scaffolding',
    credentials: ['a scaffolding certificate', 'working-at-height training'],
    skills: ['Scaffolding', 'Working at height', 'Safety harness', 'Teamwork'],
    requirements: ['Scaffolding certificate', 'Comfortable at height', 'Follow permit-to-work rules'],
    description: 'Erect, modify and dismantle scaffolding to approved designs on active sites.',
  },
  {
    title: 'Mobile Crane Operator',
    industries: ['Construction company', 'Logistics company', 'Oil & gas services company'],
    salary: [3000, 4200],
    experience: 'mobile crane',
    credentials: ['a crane operator licence', 'rigging and signalling training'],
    skills: ['Crane operation', 'Rigging', 'Load charts', 'Signalling'],
    requirements: ['Valid crane operator licence', '5+ years experience', 'Strong safety record'],
    description: 'Operate mobile cranes for lifting jobs. Plan lifts with the rigging team and inspect the machine daily.',
  },
  {
    title: 'Auto Mechanic',
    industries: ['Car rental company', 'Logistics company', 'Automotive workshop'],
    salary: [2000, 3000],
    experience: 'vehicle repair',
    credentials: ['an ITI mechanic certificate', 'a diagnostic scanner course'],
    skills: ['Engine repair', 'Diagnostics', 'Brake service', 'Preventive maintenance'],
    requirements: ['ITI or equivalent', 'Can use diagnostic scanners', 'Own basic tools'],
    description: 'Diagnose and repair light and heavy vehicles. Keep job cards accurate and finish repairs on time.',
  },
];

const COUNTRY_CITIES: Record<Country, string[]> = {
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam'],
  Qatar: ['Doha', 'Al Wakrah', 'Lusail'],
};

const COUNTRY_PAY_FACTOR: Record<Country, number> = {
  UAE: 1,
  'Saudi Arabia': 0.95,
  Qatar: 1.08,
};

const ROUND = (n: number, step: number) => Math.round(n / step) * step;

function generateJobs(count: number): Job[] {
  const rng = mulberry32(20260920);
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(rng() * items.length)] as T;
  const pickMany = <T,>(items: readonly T[], n: number): T[] => {
    const pool = [...items];
    const out: T[] = [];
    while (out.length < n && pool.length > 0) {
      out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0] as T);
    }
    return out;
  };

  const anchor = Date.UTC(2026, 8, 20, 10, 0, 0);
  const jobs: Job[] = [];

  for (let i = 0; i < count; i++) {
    const role = ROLES[i % ROLES.length] as RoleTemplate;
    const countryRoll = rng();
    const country: Country = countryRoll < 0.5 ? 'UAE' : countryRoll < 0.8 ? 'Saudi Arabia' : 'Qatar';
    const city = pick(COUNTRY_CITIES[country]);
    const factor = COUNTRY_PAY_FACTOR[country];

    const salaryMin = ROUND(role.salary[0] * factor * (0.92 + rng() * 0.16), 100);
    const spread = ROUND((role.salary[1] - role.salary[0]) * (0.7 + rng() * 0.6), 100);
    const salaryMax = salaryMin + Math.max(300, spread);

    const years = 2 + Math.floor(rng() * 9);
    const credential = pick(role.credentials);
    const reasonRoll = rng();
    const matchReason =
      reasonRoll < 0.5
        ? `${years} years of ${role.experience} experience and ${credential}`
        : reasonRoll < 0.8
          ? `Your ${role.experience} background and ${credential} fit this role`
          : `${years}+ years in ${role.experience} work, close to your preferred salary`;

    const score = 45 + Math.pow(rng(), 0.7) * 54;
    const postedAt = new Date(anchor - Math.floor(rng() * 25 * 24 * 60) * 60 * 1000);

    jobs.push({
      id: `job_${1001 + i}`,
      title: role.title,
      employer_display: `${pick(role.industries)}, ${country}`,
      country,
      city,
      salary_min_aed: salaryMin,
      salary_max_aed: salaryMax,
      match_score: Math.round(score * 10) / 10,
      match_reason: matchReason,
      skills: pickMany(role.skills, 3 + Math.floor(rng() * 2)),
      benefits: {
        accommodation: rng() < 0.7,
        food: rng() < 0.4,
        visa: rng() < 0.9,
      },
      description: `${role.description} Based in ${city}, ${country}.`,
      requirements: [...role.requirements, `${years}+ years of experience`],
      posted_at: postedAt.toISOString(),
    });
  }

  // Best match first; id as a stable tie-breaker so paging never shuffles.
  return jobs.sort((a, b) => b.match_score - a.match_score || a.id.localeCompare(b.id));
}

let cache: Job[] | null = null;

export function getAllJobs(): Job[] {
  if (cache === null) cache = generateJobs(MOCK_CONFIG.jobCount);
  return cache;
}
