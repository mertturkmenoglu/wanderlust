import { useLoaderData } from "react-router";
import { loader } from "../route";
import { items } from "./items";
import SidebarLink from "./sidebar-link";

export default function Sidebar() {
  const { auth } = useLoaderData<typeof loader>();

  const showDashboardLink = auth.role === "admin";
  const filtered = items.filter((x) => x.href !== "/dashboard");
  const links = showDashboardLink ? items : filtered;

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {links.map((el) => (
        <SidebarLink text={el.text} href={el.href} key={el.href} />
      ))}
    </nav>
  );
}
