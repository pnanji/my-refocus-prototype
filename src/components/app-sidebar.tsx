"use client"

import * as React from "react"
import { LayoutDashboard, LifeBuoy, Lock, Settings, Users } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { NavSecondary } from "@/components/nav-secondary"
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
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const secondaryItems = [
  {
    title: "Support",
    url: "https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6",
    icon: LifeBuoy,
  },
  {
    title: "Privacy",
    url: "https://www.refocusai.com/privacy-policy",
    icon: Lock,
  },
]

const userData = {
  name: "Bobby Jaffery",
  company: "CJ Insurance Group",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  
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
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = 
                    pathname === item.url || 
                    (item.url !== '/' && pathname.startsWith(item.url));
                    
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link 
                          href={item.url} 
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <NavSecondary items={secondaryItems} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}

