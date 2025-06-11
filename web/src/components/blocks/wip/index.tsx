import { Link } from '@tanstack/react-router';

export function WipComponent() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:mx-32 my-64 gap-24 lg:gap-48">
      <div className="text-sky-600">
        <div className="text-sky-600 text-2xl font-bold">Oopss</div>
        <div className="text-sky-600 text-6xl font-bold mt-4">
          Work in Progress
        </div>
        <div className="text-xl mt-8">
          Sorry for the inconvenience, but this page is still under
          construction.
        </div>
        <div>
          Our team is working like a squirrel 🐿️ to get it done. Check back
          later.
        </div>
        <Link
          to="/"
          className="rounded bg-sky-600 text-white px-4 py-2 mt-8 hover:bg-sky-500 flex font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none focus:ring-offset-2"
        >
          Country roads take me home
        </Link>
      </div>
      <div>
        <img
          src="/logo.png"
          alt="Wanderlust"
          className="size-48 min-w-48 min-h-48"
        />
      </div>
    </div>
  );
}
