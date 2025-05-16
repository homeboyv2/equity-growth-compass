
export type Founder = {
  id: string;
  name: string;
  role: string;
  email: string;
  scores: {
    role: number;
    usefulness: number;
    ideaContribution: number;
    businessPlan: number;
    expertise: number;
    commitment: number;
    operations: number;
  };
  contributions: {
    cash: number;
    time: number;
    skills: number;
  };
  equityPercentage: number;
  color: string;
};

export type Milestone = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  current: boolean;
  weight: number; // Added weight field for milestones
};

export type AppState = {
  founders: Founder[];
  milestones: Milestone[];
  currentMilestoneId: string;
  history: {
    milestoneId: string;
    milestoneName: string;
    date: string;
    founders: Founder[];
  }[];
  contributionWeights: {
    cash: number;
    time: number;
    skills: number;
  };
};

export const CRITERIA = [
  { id: 'role', label: 'Role in Project', description: 'Functions taken on from the beginning (e.g., tech, product, business)' },
  { id: 'usefulness', label: 'Usefulness to Project', description: 'Tangible impact on project progress' },
  { id: 'ideaContribution', label: 'Idea Contribution', description: 'Who proposed the original concept' },
  { id: 'businessPlan', label: 'Business Plan Development', description: 'Who structured the vision and strategy' },
  { id: 'expertise', label: 'Domain Expertise', description: 'Industry knowledge, network, credibility' },
  { id: 'commitment', label: 'Personal Commitment & Risk', description: 'Time invested, financial or professional risks taken' },
  { id: 'operations', label: 'Operational Responsibilities', description: 'Day-to-day execution roles' }
];

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'initial',
    name: 'Initial Assessment',
    description: 'First evaluation of co-founder contributions',
    completed: false,
    current: true,
    weight: 1.0
  },
  {
    id: 'mvp',
    name: 'MVP Development',
    description: 'Minimum viable product creation phase',
    completed: false,
    current: false,
    weight: 1.0
  },
  {
    id: 'pmf',
    name: 'Product-Market Fit',
    description: 'Validation that product meets market needs',
    completed: false,
    current: false,
    weight: 1.0
  },
  {
    id: 'fundraising',
    name: 'Fundraising Rounds',
    description: 'Securing investment capital',
    completed: false,
    current: false,
    weight: 1.0
  },
  {
    id: 'team-growth',
    name: 'Team Growth & Structure',
    description: 'Expansion of team and organizational structure',
    completed: false,
    current: false,
    weight: 1.0
  },
  {
    id: 'revenue',
    name: 'Revenue Generation',
    description: 'Beginning to generate consistent revenue',
    completed: false,
    current: false,
    weight: 1.0
  },
  {
    id: 'expansion',
    name: 'International Expansion',
    description: 'Expanding operations to new markets',
    completed: false,
    current: false,
    weight: 1.0
  }
];

export const FOUNDER_COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F97316', // Orange
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
];

export const DEFAULT_CONTRIBUTION_WEIGHTS = {
  cash: 1.0,
  time: 1.0,
  skills: 1.0
};
