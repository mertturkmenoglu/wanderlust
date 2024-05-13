import { auth } from "@clerk/nextjs/server";
import { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren): React.ReactElement {
  auth().protect();
  return <div>{children}</div>;
}

export default Layout;
