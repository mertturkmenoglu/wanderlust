import Bio from './_components/bio';
import Tabs from './_components/tabs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  children: React.ReactNode;
  params: {
    username: string;
  };
};

export default function Layout({ children, params: { username } }: Props) {
  return (
    <div className="container">
      <Bio username={username} />

      <hr className="mx-auto my-4 hidden max-w-4xl md:block" />

      <Tabs
        className="my-4"
        username={username}
      />

      <div>{children}</div>
    </div>
  );
}
