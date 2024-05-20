import NewAddressForm from "./_components/form";

function Page() {
  return (
    <div>
      <div>
        <div>
          <h3 className="text-lg font-bold tracking-tight my-8">
            Create New Address
          </h3>
          <NewAddressForm />
        </div>
      </div>
    </div>
  );
}

export default Page;
