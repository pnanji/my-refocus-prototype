// Client types
export interface Client {
  id: string;
  name: string;
  cancellationRisk: 'High' | 'Medium' | 'Low';
  applicantId: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  reason: string;
  renewalDate: string;
  dateAdded: string;
  premium: number;
}

export interface ClientSummary {
  clientId: string;
  customerProfile: string;
  interactionHistory: string;
  claimsHistory: ClaimItem[];
  reasonForRemarket: string;
}

export interface ClaimItem {
  date: string;
  type: string;
  description: string;
  amount: number;
}

// Quote types
export interface HomeQuote {
  id: string;
  clientId: string;
  carriers: HomeCarrier[];
}

export interface HomeCarrier {
  id: string;
  name: string;
  premium: number;
  coverages: HomeCoverage[];
}

export interface HomeCoverage {
  type: string;
  limit: string | number;
  option?: string;
  deductible?: string | number;
}

export interface AutoQuote {
  id: string;
  clientId: string;
  carriers: AutoCarrier[];
  vehicles: Vehicle[];
}

export interface Vehicle {
  year: number;
  make: string;
  model: string;
  trim?: string;
}

export interface AutoCarrier {
  id: string;
  name: string;
  premium: number;
  term?: string;
  coverages: AutoCoverage[];
}

export interface AutoCoverage {
  type: string;
  limit: string | number;
  option?: string;
  deductible?: string | number;
} 