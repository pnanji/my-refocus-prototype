"use client"

import * as React from "react"
import { Home, LifeBuoy, Lock, Settings, Users } from "lucide-react"
import Image from "next/image"

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
    title: "Home",
    url: "/",
    icon: Home,
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
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <div className="dark">
      <Sidebar variant="inset" className="border-r bg-sidebar text-sidebar-foreground" {...props}>
        <SidebarHeader className="flex justify-center items-center py-4">
          <div className="w-full flex justify-center items-center">
            <Image 
              src="/ReFocus Logo.svg" 
              alt="ReFocus AI Logo" 
              width={108}
              height={36}
              className="scale-95"
              priority
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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

