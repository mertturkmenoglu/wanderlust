import NewLocationForm from "./_components/form";

function Page() {
  return (
    <div>
      <div>
        <div>
          <h3 className="text-lg font-bold tracking-tight my-8">
            Create New Location
          </h3>
          <NewLocationForm />
        </div>
      </div>
    </div>
  );
}

export default Page;
