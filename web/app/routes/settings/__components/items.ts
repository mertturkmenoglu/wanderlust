export type Item = {
  text: string;
  href: string;
};

export const items = [
  {
    text: "General",
    href: "/settings",
  },
  {
    text: "Account",
    href: "/settings/account",
  },
  {
    text: "Profile",
    href: "/settings/profile",
  },
  {
    text: "Dashboard",
    href: "/dashboard",
  },
] as const satisfies Item[];
