import { PropsWithChildren } from 'react';

export default function Layout({
  children,
}: PropsWithChildren): React.ReactElement {
  return <div className="container my-16">{children}</div>;
}
