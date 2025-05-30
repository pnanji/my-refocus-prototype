"use client";

import React, { useState, useContext, createContext } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useConfig } from "@/components/config-panel";

// Sample carrier data
const sampleCarriers = [
  {
    id: "progressive",
    name: "Progressive",
    logo: "/carrier-logos/progressive.png",
  },
  {
    id: "bristol-west", 
    name: "Bristol West",
    logo: "/carrier-logos/bristol-west.png",
  },
  {
    id: "allstate",
    name: "Allstate",
    logo: "/carrier-logos/allstate.png",
  },
  {
    id: "nationwide",
    name: "Nationwide",
    logo: "/carrier-logos/nationwide.png",
  },
  {
    id: "safeco",
    name: "Safeco",
    logo: "/carrier-logos/safeco.png",
  },
];

// Create a context for managing saved carriers
const SavedCarriersContext = createContext<{
  savedCarrierIds: string[];
  addSavedCarrier: (carrierId: string) => void;
}>({
  savedCarrierIds: [],
  addSavedCarrier: () => {},
});

// Provider component that will wrap the entire app
export function SavedCarriersProvider({ children }: { children: React.ReactNode }) {
  const [savedCarrierIds, setSavedCarrierIds] = useState<string[]>([]);

  const addSavedCarrier = (carrierId: string) => {
    setSavedCarrierIds(prev => {
      if (!prev.includes(carrierId)) {
        return [...prev, carrierId];
      }
      return prev;
    });
  };

  return (
    <SavedCarriersContext.Provider value={{ savedCarrierIds, addSavedCarrier }}>
      {children}
    </SavedCarriersContext.Provider>
  );
}

// Hook to use the saved carriers context
export function useSavedCarriers() {
  return useContext(SavedCarriersContext);
}

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { showCarriersEmptyState } = useConfig();
  const { savedCarrierIds } = useSavedCarriers();
  
  const filteredCarriers = sampleCarriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the default carriers (first 3) plus any newly saved carriers
  const defaultCarrierIds = ["progressive", "bristol-west", "allstate"];
  const allActiveCarrierIds = [...new Set([...defaultCarrierIds, ...savedCarrierIds])];
  const displayedCarriers = showCarriersEmptyState 
    ? [] 
    : sampleCarriers
        .filter(carrier => allActiveCarrierIds.includes(carrier.id))
        .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-base font-medium text-gray-900">Carriers</h1>
            <p className="text-sm text-gray-500">
              Manage insurance carriers and their access credentials for automated quoting
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <h2 className="text-base font-medium text-gray-900 mb-3">Search Carrier to Add</h2>
            <Input
              type="text"
              placeholder="Find a carrier"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Carriers List (Search Results) */}
          {searchQuery && (
            <div className="bg-white border rounded-lg overflow-hidden mb-8">
              {filteredCarriers.length > 0 ? (
                filteredCarriers.map((carrier, index) => (
                  <Link 
                    href={`/settings/carriers/${carrier.id}`} 
                    key={carrier.id}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md mr-4">
                            <Building2 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">{carrier.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <ChevronRight className="text-gray-400 h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    {index < filteredCarriers.length - 1 && (
                      <div className="mx-6 border-b border-gray-200"></div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No carriers found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          {/* Existing Carriers Section */}
          {!showCarriersEmptyState && displayedCarriers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-medium text-gray-900 mb-3">Your Carriers</h2>
              <div className="bg-white border rounded-lg overflow-hidden">
                {displayedCarriers.map((carrier, index) => (
                  <Link 
                    href={`/settings/carriers/${carrier.id}`} 
                    key={carrier.id}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md mr-4">
                            <Building2 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">{carrier.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <ChevronRight className="text-gray-400 h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    {index < displayedCarriers.length - 1 && (
                      <div className="mx-6 border-b border-gray-200"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {showCarriersEmptyState && !searchQuery && (
            <div className="bg-white border rounded-lg p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for carriers</h3>
              <p className="text-gray-500 mb-4">
                Search for carriers above to get started with automated remarketing
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}