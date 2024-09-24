import { NavLink } from "@remix-run/react";
import { Item } from "./items";

type SidebarLinkProps = Item;

export default function SidebarLink({ text, href }: SidebarLinkProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        isActive ? "font-semibold text-primary" : "hover:underline"
      }
      end
    >
      {text}
    </NavLink>
  );
}
