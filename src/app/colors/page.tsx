"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the color extractor component with no SSR
const LogoColorExtractor = dynamic(
  () => import('@/components/ui/logo-color-extractor').then(mod => ({ default: mod.LogoColorExtractor })),
  { ssr: false }
);

// Create a loading placeholder
function LoadingPlaceholder() {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
      <div className="h-32 bg-gray-100 rounded mb-6"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-[720px] mx-auto px-4 pb-10">
          <h1 className="text-2xl font-semibold mb-3">Colors Tool</h1>
          
          <p className="text-gray-600 mb-6">
            Extract brand colors from carrier logos for consistent UI styling across your dashboard.
          </p>
          
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <Suspense fallback={<LoadingPlaceholder />}>
              <LogoColorExtractor />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 