"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
  // Connections section items
  const connectionItems: SettingsMenuItem[] = [
    {
      title: "AMS360",
      description: "Manage your connection to AMS360",
      icon: "/AMS360-logo.png",
      href: "/settings/ams360",
    },
    {
      title: "CRM Connection",
      description: "Connect or edit a connection to a CRM",
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
      description: "Select which types of policies to include in your analysis and prediction model",
      href: "/settings/filter-options",
      isNew: true,
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
            <ChevronRight className="text-gray-400 h-5 w-5" />
          </div>
        </div>
        {!isLast && <div className="mx-6 border-b border-gray-200"></div>}
      </div>
    </Link>
  );

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-[640px] mx-auto px-4">
          {/* Connections Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Connections</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              {connectionItems.map((item, index) => 
                renderMenuItem(item, index === connectionItems.length - 1)
              )}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Preferences</h2>
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