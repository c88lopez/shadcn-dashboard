"use server";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "@/components/ui/nav-user";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sections } from "@/components/app-sections";

const isJWTExpired = (accessToken: string) => {
  if (!accessToken) {
    return true;
  }

  const accessTokenPayload = accessToken
    .split(".")[1]
    .replace("-", "+")
    .replace("_", "/");

  const data = JSON.parse(
    Buffer.from(accessTokenPayload, "base64").toString("utf-8"),
  );

  return Math.floor(data.exp - new Date().getTime() / 1000) <= 0;
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  if (isJWTExpired(session?.user?.id ?? "")) {
    redirect("/login");
  }

  const profileResponse = await fetch(`${process.env.AUTH_API_URL}/profile`, {
    headers: { Authorization: `Bearer ${session?.user?.id}` },
  });

  const response = await profileResponse.json();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        {Sections.map((section) => (
          <SidebarGroup key={section.groupName}>
            <SidebarGroupLabel>{section.groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.groupItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            username: response.username,
            email: response.email,
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
