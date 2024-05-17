"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Item } from "./items";

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

export default SidebarLink;
