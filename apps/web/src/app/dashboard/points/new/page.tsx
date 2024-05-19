import NewPointForm from "./_components/form";

function Page() {
  return (
    <div>
      <div>
        <div>
          <h3 className="text-lg font-bold tracking-tight my-8">
            Create New Point
          </h3>
          <NewPointForm />
        </div>
      </div>
    </div>
  );
}

export default Page;
