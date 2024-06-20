import Bio from './_components/bio';
import Tabs from './_components/tabs';

type Props = {
  children: React.ReactNode;
  params: {
    username: string;
  };
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Layout({ children, params: { username } }: Props): React.ReactElement {
  return (
    <div className="container">
      <Bio username={username} />

      <Tabs
        className="my-4"
        username={username}
      />

      <div>{children}</div>
    </div>
  );
}

export default Layout;
