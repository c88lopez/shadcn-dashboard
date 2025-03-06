"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { usePathname } from "next/navigation";
import { Sections } from "@/components/app-sections";

function getCurrentTitle(pathname: string) {
  if (pathname === "/") {
    return "";
  }

  for (const section of Sections) {
    for (const item of section.groupItems) {
      if (item.url === pathname) {
        return item.title;
      }
    }
  }

  return "";
}

export default function AppBreadcrumb() {
  const pathname = usePathname();

  const title = getCurrentTitle(pathname);

  console.log({ pathname, title });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {title !== "" && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
