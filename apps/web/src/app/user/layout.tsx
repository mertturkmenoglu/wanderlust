type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props): React.ReactElement {
  return <div>{children}</div>;
}

export default Layout;
