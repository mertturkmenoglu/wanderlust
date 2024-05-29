import { PropsWithChildren } from 'react';

export default function Layout({
  children,
}: PropsWithChildren): React.ReactElement {
  return <div>{children}</div>;
}
