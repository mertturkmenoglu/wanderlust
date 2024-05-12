type Props = {
  params: {
    username: string;
  };
};

function Page({ params }: Props): React.ReactElement {
  return (
    <main>
      <div>Username: {params.username}</div>
    </main>
  );
}

export default Page;
