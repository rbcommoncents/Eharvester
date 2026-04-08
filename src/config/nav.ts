export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Applications", href: "/applications" },
  { label: "Add Application", href: "/applications/new" },
  { label: "Profile", href: "/profile" },
];