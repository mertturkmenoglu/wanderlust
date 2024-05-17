"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {};

type Item = {
  text: string;
  href: string;
};

const items = [
  {
    text: "General",
    href: "/settings",
  },
  {
    text: "Profile",
    href: "/settings/profile",
  },
] as const satisfies Item[];

type SidebarLinkProps = Item;

function SidebarLink({ text, href }: SidebarLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn({
        "font-semibold text-primary": pathname === href,
      })}
    >
      {text}
    </Link>
  );
}

function Sidebar({}: Props): React.ReactElement {
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {items.map((el) => (
        <SidebarLink text={el.text} href={el.href} key={el.href} />
      ))}
    </nav>
  );
}

export default Sidebar;
