import NewEventForm from './_components/form';

function Page() {
  return (
    <div>
      <div>
        <div>
          <h3 className="mb-8 text-lg font-bold tracking-tight">
            Create New Event
          </h3>
          <NewEventForm />
        </div>
      </div>
    </div>
  );
}

export default Page;
