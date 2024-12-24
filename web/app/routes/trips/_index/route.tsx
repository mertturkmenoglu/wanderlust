import SquirrelIcon from "~/components/icons/squirrel";

export default function Page() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <img src="/trip.png" className="size-64" />
      <h2 className="mt-8 text-4xl font-bold text-center">
        Plan your next trip with
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-600">
          Wanderlust
        </span>
      </h2>
      <SquirrelIcon className="size-32 text-primary my-8" />
      <div>New Trip</div>
      <div>Discover Trips</div>
      <div>My Trips</div>
    </div>
  );
}
