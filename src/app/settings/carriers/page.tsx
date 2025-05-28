"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Sample carrier data
const sampleCarriers = [
  {
    id: "allstate",
    name: "Allstate",
    logo: "/carrier-logos/allstate.png", // We'll use placeholder for now
    isConnected: false,
  },
  {
    id: "bristol-west",
    name: "Bristol West",
    logo: "/carrier-logos/bristol-west.png",
    isConnected: true,
  },
  {
    id: "nationwide",
    name: "Nationwide",
    logo: "/carrier-logos/nationwide.png",
    isConnected: false,
  },
  {
    id: "progressive",
    name: "Progressive",
    logo: "/carrier-logos/progressive.png",
    isConnected: true,
  },
  {
    id: "safeco",
    name: "Safeco",
    logo: "/carrier-logos/safeco.png",
    isConnected: false,
  },
];

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedCarriers] = useState(sampleCarriers.filter(c => c.isConnected));
  
  const filteredCarriers = sampleCarriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Connected Carriers Section */}
          {connectedCarriers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-medium text-gray-900 mb-3">Connected Carriers</h2>
              <div className="bg-white border rounded-lg overflow-hidden">
                {connectedCarriers.map((carrier, index) => (
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
                            <p className="text-sm text-green-600">Connected</p>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-400 h-5 w-5" />
                      </div>
                    </div>
                    {index < connectedCarriers.length - 1 && (
                      <div className="mx-6 border-b border-gray-200"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="mb-6">
            <h2 className="text-base font-medium text-gray-900 mb-3">
              {connectedCarriers.length > 0 ? "Add More Carriers" : "Search Carrier to Add"}
            </h2>
            <Input
              type="text"
              placeholder="Find a carrier"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Carriers List */}
          {searchQuery && (
            <div className="bg-white border rounded-lg overflow-hidden">
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
                            <p className="text-sm text-gray-500">
                              {carrier.isConnected ? "Connected" : "Not connected"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-400 h-5 w-5" />
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

          {/* Empty State */}
          {!searchQuery && connectedCarriers.length === 0 && (
            <div className="bg-white border rounded-lg p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No carriers connected</h3>
              <p className="text-gray-500 mb-4">
                Search for carriers above to get started with automated quoting
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 