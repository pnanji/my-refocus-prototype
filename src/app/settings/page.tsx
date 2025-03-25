"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useConfig } from "@/components/config-panel";
import Image from "next/image";
import { ChevronRight, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the types for menu items
interface SettingsMenuItem {
  title: string;
  description: string;
  icon?: string;
  href: string;
  isNew?: boolean;
  requiresAms?: boolean;
}

export default function SettingsPage() {
  const { showAmsConnectionError, showCrmConnectionError, isAggregator, isAmsConnected } = useConfig();
  
  // Connections section items
  const connectionItems: SettingsMenuItem[] = [
    {
      title: "AMS",
      description: "Manage connection to your AMS",
      icon: "/AMS360-logo.png",
      href: "/settings/ams",
    },
    {
      title: "CRM",
      description: "Manage connection and notifications to a CRM",
      icon: "/person-card-icon.svg",
      href: "/settings/crm",
    },
  ];

  // Preferences section items
  const preferenceItems: SettingsMenuItem[] = [
    {
      title: "Data Mapping",
      description: "Map your AMS data to our standard categories",
      href: "/settings/data-mapping",
      requiresAms: true,
    },
    {
      title: "Filter Options",
      description: "Select which types of policies to include in your at-risk prediction model",
      href: "/settings/filter-options",
      requiresAms: true,
    },
    {
      title: "Notifications",
      description: "Control how we notify you about upcoming at-risk renewals",
      href: "/settings/notifications",
      requiresAms: true,
    },
  ];

  // Organization section items
  const organizationItems: SettingsMenuItem[] = [
    ...(isAggregator ? [
      {
        title: "Agency Management",
        description: "Manage agencies and their feature access",
        href: "/settings/agencies",
      }
    ] : []),
    {
      title: "User Management",
      description: "Manage users and their roles within your agency",
      href: "/settings/users",
    },
  ];

  // Render a settings menu item
  const renderMenuItem = (item: SettingsMenuItem, isLast: boolean) => {
    // Check if item is disabled due to no AMS connection
    const isDisabled = item.requiresAms && !isAmsConnected;
    
    const MenuItem = (
      <div className={`hover:bg-gray-50 transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {item.icon && (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md mr-4">
                  <Image src={item.icon} alt={item.title} width={24} height={24} />
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.title === "AMS" && showAmsConnectionError && (
                <div className="bg-red-50 border border-red-200 text-red-900 text-xs rounded-sm font-medium whitespace-nowrap px-2 py-0.5">
                  Connection Issue
                </div>
              )}
              {item.title === "AMS" && !isAmsConnected && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-sm font-medium whitespace-nowrap px-2 py-0.5">
                  No AMS Connected
                </div>
              )}
              {item.title === "CRM" && showCrmConnectionError && (
                <div className="bg-red-50 border border-red-200 text-red-900 text-xs rounded-sm font-medium whitespace-nowrap px-2 py-0.5">
                  Connection Issue
                </div>
              )}
              {item.isNew && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-sm font-medium whitespace-nowrap">
                  <div className="px-2 py-0.5 flex items-center">
                    New
                  </div>
                </div>
              )}
              <ChevronRight className="text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
        {!isLast && <div className="mx-6 border-b border-gray-200"></div>}
      </div>
    );
    
    // If disabled, don't wrap in Link
    if (isDisabled) {
      return <div key={item.title}>{MenuItem}</div>;
    }
    
    // Otherwise, wrap in Link
    return (
      <Link href={item.href} key={item.title} className="block">
        {MenuItem}
      </Link>
    );
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* AMS Connection Error Alert */}
          {showAmsConnectionError && (
            <Alert variant="error" className="bg-red-50 border border-red-200 mb-6">
              <AlertDescription className="text-gray-900">
                We're having trouble connecting to your AMS. Please click on AMS section below to re-enter your credentials or <Link href="https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6" className="underline">contact our support team</Link> for assistance.
              </AlertDescription>
            </Alert>
          )}

          {/* AMS Connection Alert */}
          {!isAmsConnected && (
            <Alert variant="warning" className="bg-amber-50 border border-amber-200 mb-6">
              <AlertDescription className="text-sm">
                You need to connect an AMS to enable data mapping, filter options, and notifications. 
                <Link href="/settings/ams" className="font-medium underline ml-1">
                  Click here to set up your AMS
                </Link>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Connections Section */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-3">Connections</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              {connectionItems.map((item, index) => 
                renderMenuItem(item, index === connectionItems.length - 1)
              )}
            </div>
          </div>

          {/* Organization Section */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-3">Organization</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              {organizationItems.map((item, index) => 
                renderMenuItem(item, index === organizationItems.length - 1)
              )}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-3">Preferences</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              {preferenceItems.map((item, index) => 
                renderMenuItem(item, index === preferenceItems.length - 1)
              )}
            </div>
          </div>

          {/* Close Account Section */}
          <div>
            <h2 className="text-base font-medium text-gray-900 mb-3">Close Account</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Closing your account will permanently delete all your data and cancel your subscription. This action cannot be undone.
                </p>
                <div className="flex justify-end">
                  <Link 
                    href="https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6" 
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Contact us to close account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 