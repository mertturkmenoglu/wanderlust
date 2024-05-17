import { auth } from "@clerk/nextjs/server";
import { PropsWithChildren } from "react";
import Sidebar from "./_components/Sidebar";

function Layout({ children }: PropsWithChildren): React.ReactElement {
  auth().protect();
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h2 className="text-3xl font-semibold">Settings</h2>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Sidebar />
          <div className="grid gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
