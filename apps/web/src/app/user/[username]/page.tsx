import Bio from "./_components/bio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: {
    username: string;
  };
};

export default async function Page({ params: { username } }: Props) {
  return (
    <main>
      <Bio username={username} className="mt-16" />
    </main>
  );
}
