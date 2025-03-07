"use client";

import { ReactNode } from "react";
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

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      
      <SidebarInset className="flex-1 p-6 bg-gray-50 text-foreground">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="cursor-pointer">
              <PanelLeftIcon className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className="h-6 w-px bg-gray-200 ml-1 mr-3" /> {/* Vertical divider with asymmetric margins */}
            
            <nav aria-label="breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                
                {pathname !== "/" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {pathname.split("/")[1]?.charAt(0).toUpperCase() + pathname.split("/")[1]?.slice(1) || ""}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
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