import { canAccessOrg } from "@/lib/org-access";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  auth().protect();
  const ok = canAccessOrg();

  if (!ok) {
    redirect("/");
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {children}
    </div>
  );
}

export default Layout;
