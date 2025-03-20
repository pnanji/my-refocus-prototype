"use client";

import { useState, useEffect } from "react";

// This hook fetches the agency name based on an ID
export function useAgencyName(agencyId: string | null) {
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyId) {
      setAgencyName(null);
      setLoading(false);
      return;
    }

    // Simulate API call
    const fetchAgencyName = async () => {
      setLoading(true);
      
      // Simulated API response - in a real app, this would be an API call
      setTimeout(() => {
        // Map agency IDs to names
        const agencyNames: Record<string, string> = {
          "1": "Acme Insurance Agency",
          "2": "Best Coverage Insurance",
          "3": "Safe Haven Insurance",
          "4": "Coastal Protection Group",
          "5": "Mountain State Insurance",
          "6": "Evergreen Coverage",
          "7": "Golden State Insurers",
          "8": "Lone Star Insurance",
          "9": "Keystone Coverage Solutions",
          "10": "Windy City Protectors",
          "11": "Capital Risk Management",
          "12": "Bayou Insurance Group",
          "13": "Desert Sun Coverage"
        };
        
        const name = agencyNames[agencyId] || `Agency ${agencyId}`;
        setAgencyName(name);
        setLoading(false);
      }, 100);
    };

    fetchAgencyName();
  }, [agencyId]);

  return { agencyName, loading };
} 