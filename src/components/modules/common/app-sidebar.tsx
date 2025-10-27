"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logout } from "@/services/auth";
import { getNavData } from "@/utils/SidebarData";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar({ user }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const data = getNavData(user?.role);

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-auto">
          <Button
            className="w-full"
            onClick={() => {
              logout();
              router.push("/auth");
            }}
          >
            Log Out
          </Button>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
