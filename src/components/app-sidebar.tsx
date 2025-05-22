"use client"

import * as React from "react"
import { LayoutDashboard, Settings, Users, Palette, AlertCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useConfig } from "@/components/config-panel"
import { Progress } from "@/components/ui/progress"
import { subscriptionData } from "@/data/subscription"
import { Route } from "next"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Remarkets",
    url: "/remarkets",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Colors Tool",
    url: "/colors",
    icon: Palette,
  },
]

const userData = {
  name: "Bobby Jaffery",
  company: "CJ Insurance Group",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { showAmsConnectionError, showCrmConnectionError, exceedRemarketingQuota } = useConfig();
  
  // Check if there's any connection error
  const hasConnectionError = showAmsConnectionError || showCrmConnectionError;
  
  // Monthly analyzed accounts (for this prototype, matching billing page)
  const monthlyAnalyzedAccounts = 256;
  
  // Remarketing quota calculations for mini card - updated to match billing page
  const totalRemarketsAllowed = Math.round(monthlyAnalyzedAccounts * (subscriptionData.remarketsPercentage / 100));
  const remarketingOverage = exceedRemarketingQuota ? 15 : 0; // Using 15 accounts over to match billing page
  const usedRemarketing = exceedRemarketingQuota 
    ? totalRemarketsAllowed + remarketingOverage 
    : Math.round(totalRemarketsAllowed * 0.75); // Using 75% of the monthly quota to match billing page
  
  // Render the mini remarketing card
  const renderRemarketingCard = () => {
    if (!exceedRemarketingQuota) return null;
    
    return (
      <div className="px-4 py-2 mb-2">
        <div className="bg-sidebar border border-gray-700 rounded-lg p-3 text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <h4 className="text-xs font-semibold">Remarketing Quota Exceeded</h4>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs text-gray-400">Usage</div>
              <div className="text-xs font-medium text-gray-300">
                {usedRemarketing.toLocaleString()} / {totalRemarketsAllowed.toLocaleString()}
              </div>
            </div>
            <Progress 
              value={100} 
              className="h-1.5 bg-gray-800 [&>div]:bg-yellow-600"
            />
          </div>
          
          <Link 
            href="/settings/billing" 
            className="flex items-center justify-center gap-1 text-xs text-gray-200 border border-gray-600 hover:bg-gray-700 transition-colors py-1.5 px-2 rounded font-medium mt-2"
          >
            <span>View Billing</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  };
  
  return (
    <div className="dark">
      <Sidebar variant="inset" className="border-r bg-sidebar text-sidebar-foreground" {...props}>
        <SidebarHeader className="flex justify-center items-center py-4">
          <div className="w-full flex justify-center items-center">
            <Image 
              src="/ReFocus Logo.svg" 
              alt="ReFocus AI Logo" 
              width={132}
              height={36}
              priority
            />
          </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col h-full">
          <div className="flex-grow">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = 
                      pathname === item.url || 
                      (item.url !== '/' && pathname.startsWith(item.url));
                      
                    // Check if this is the Settings item and if we need to show the notification dot
                    // Only show for connection errors, not for quota exceeded
                    const showNotificationDot = item.title === "Settings" && hasConnectionError;
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link 
                            href={item.url as Route} 
                            className="flex items-center gap-2 relative"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                            {showNotificationDot && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                <div className="w-[18px] h-[18px] rounded-full bg-red-700 flex items-center justify-center">
                                  <span className="text-white font-bold text-[11px]" style={{ lineHeight: 1 }}>!</span>
                                </div>
                              </div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          
          {/* Mini Remarketing Usage Card - Only show when quota is exceeded */}
          {renderRemarketingCard()}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}

