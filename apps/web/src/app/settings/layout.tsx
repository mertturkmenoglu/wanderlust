import { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren): React.ReactElement {
  return <div>{children}</div>;
}

export default Layout;
