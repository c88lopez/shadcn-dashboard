import {
  Contact,
  Home,
  LucideIcon,
  Swords,
  Trophy,
  User,
  Users,
} from "lucide-react";

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
      {
        title: "Players",
        url: "/",
        icon: Contact,
      },
      {
        title: "Matches",
        url: "/",
        icon: Swords,
      },
      {
        title: "Tournaments",
        url: "/",
        icon: Trophy,
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
