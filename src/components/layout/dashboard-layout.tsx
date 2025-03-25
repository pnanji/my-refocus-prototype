"use client";

import React, { ReactNode } from "react";
import { PanelLeftIcon } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useAgencyName } from "@/hooks/use-agency-name";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(segment => segment);
  
  // Check if we're in an agency path
  const isAgencyPath = pathSegments.length >= 3 && 
                      pathSegments[0] === "settings" && 
                      pathSegments[1] === "agencies";
  
  // If we're in an agency path, get the agency ID
  const agencyId = isAgencyPath ? pathSegments[2] : null;
  
  // Use our custom hook to get the agency name
  const { agencyName, loading } = useAgencyName(agencyId);
  
  // Function to capitalize the first letter of a string
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  // Function to format segment text for display
  const formatSegmentText = (segment: string, index: number) => {
    // Check if this is an agency ID segment and we have the agency name
    if (isAgencyPath && index === 2 && agencyName && !loading) {
      return agencyName;
    }
    
    if (segment.toLowerCase() === 'crm') {
      return 'CRM';
    }
    if (segment.toLowerCase() === 'ams' || segment.toLowerCase() === 'ams360') {
      return 'AMS';
    }
    if (segment.toLowerCase() === 'data-mapping') {
      return 'Data Mapping';
    }
    if (segment.toLowerCase() === 'filter-options') {
      return 'Filter Options';
    }
    if (segment.toLowerCase() === 'close-account') {
      return 'Close Account';
    }
    return capitalize(segment);
  };
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      
      <SidebarInset className="flex-1 p-6 bg-gray-50 text-foreground overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="cursor-pointer">
              <PanelLeftIcon className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className="h-6 w-px bg-gray-200 ml-1 mr-3" /> {/* Vertical divider with asymmetric margins */}
            
            <nav aria-label="breadcrumb">
              <BreadcrumbList>
                {pathSegments.length === 0 ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  pathSegments.map((segment, index) => {
                    const segmentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLastSegment = index === pathSegments.length - 1;
                    
                    return (
                      <React.Fragment key={segment}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {isLastSegment ? (
                            <BreadcrumbPage>{formatSegmentText(segment, index)}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={segmentPath}>{formatSegmentText(segment, index)}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })
                )}
              </BreadcrumbList>
            </nav>
          </div>
        </div>
        
        {children}
      </SidebarInset>
    </div>
  );
} 