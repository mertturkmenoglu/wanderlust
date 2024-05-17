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
    <main className="container mt-16">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Dashboard</h2>
        <p className="text-muted-foreground">Manage your app</p>
      </div>
      <div className="my-16">{children}</div>
    </main>
  );
}

export default Layout;
