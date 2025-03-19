import { Home, LucideIcon, User, Users } from "lucide-react";

type Section = {
  groupName: string;
  groupItems: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
  }>;
};

export const Sections: Section[] = [
  {
    groupName: "Application",
    groupItems: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  {
    groupName: "Settings",
    groupItems: [
      {
        title: "Users",
        url: "/users",
        icon: User,
      },
      {
        title: "User Groups",
        url: "/user-groups",
        icon: Users,
      },
    ],
  },
];
