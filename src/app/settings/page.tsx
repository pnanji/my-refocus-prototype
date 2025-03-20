"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useConfig } from "@/components/config-panel";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// Define the types for menu items
interface SettingsMenuItem {
  title: string;
  description: string;
  icon?: string;
  href: string;
  isNew?: boolean;
}

export default function SettingsPage() {
  const { showAmsConnectionError, showCrmConnectionError, isAggregator } = useConfig();
  
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
      title: "Notifications",
      description: "Control how we notify you about upcoming at-risk renewals",
      href: "/settings/notifications",
    },
    {
      title: "Data Mapping",
      description: "Map your AMS data to our standard categories",
      href: "/settings/data-mapping",
    },
    {
      title: "Filter Options",
      description: "Select which types of policies to include in your at-risk prediction model",
      href: "/settings/filter-options",
      isNew: true,
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
  const renderMenuItem = (item: SettingsMenuItem, isLast: boolean) => (
    <Link href={item.href} key={item.title} className="block">
      <div className="hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {item.icon && (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md mr-4">
                  <Image src={item.icon} alt={item.title} width={24} height={24} />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  {item.isNew && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-sm font-medium">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.title === "AMS" && showAmsConnectionError && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">
                  CONNECTION ISSUE
                </span>
              )}
              {item.title === "CRM" && showCrmConnectionError && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">
                  CONNECTION ISSUE
                </span>
              )}
              <ChevronRight className="text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
        {!isLast && <div className="mx-6 border-b border-gray-200"></div>}
      </div>
    </Link>
  );

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
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
        </div>
      </div>
    </DashboardLayout>
  );
} 