export interface Carrier {
  id: string;
  name: string;
  logo: string;
  hasLogo: boolean;
}

export type CarrierGroup = 'primary' | 'secondary' | 'tertiary';

export interface CarrierGroups {
  primary: Carrier[];
  secondary: Carrier[];
  tertiary: Carrier[];
}

// Sample carriers data
export const sampleCarriers: CarrierGroups = {
  primary: [
    {
      id: "progressive",
      name: "Progressive",
      logo: "/progressive-small.png",
      hasLogo: true
    },
    {
      id: "travelers",
      name: "Travelers",
      logo: "/travelers-small.png",
      hasLogo: true
    },
    {
      id: "nationwide",
      name: "Nationwide",
      logo: "/nationwide-small.png",
      hasLogo: true
    }
  ],
  secondary: [
    {
      id: "branch",
      name: "Branch",
      logo: "/branch-small.png",
      hasLogo: true
    },
    {
      id: "safeco",
      name: "SafeCo",
      logo: "", // No logo available
      hasLogo: false
    },
    {
      id: "bristol-west",
      name: "Bristol West",
      logo: "/bristolwest-logo.png",
      hasLogo: true
    }
  ],
  tertiary: [
    {
      id: "liberty-mutual",
      name: "Liberty Mutual",
      logo: "",
      hasLogo: false
    },
    {
      id: "state-farm",
      name: "State Farm",
      logo: "",
      hasLogo: false
    },
    {
      id: "allstate",
      name: "Allstate",
      logo: "",
      hasLogo: false
    },
    {
      id: "geico",
      name: "GEICO",
      logo: "",
      hasLogo: false
    }
  ]
}; 