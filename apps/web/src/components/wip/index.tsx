import { Link } from '@tanstack/react-router';
import { Logo } from '../logo';

export function WipComponent() {
	return (
		<div className="my-64 flex flex-col-reverse items-center justify-center gap-24 lg:mx-32 lg:flex-row lg:gap-48">
			<div className="text-sky-600">
				<div className="font-bold text-2xl text-sky-600">Oopss</div>
				<div className="mt-4 font-bold text-6xl text-sky-600">
					Work in Progress
				</div>
				<div className="mt-8 text-xl">
					Sorry for the inconvenience, but this page is still under
					construction.
				</div>
				<div>
					Our team is working like a squirrel 🐿️ to get it done. Check back
					later.
				</div>
				<Link
					to="/"
					className="mt-8 flex rounded bg-sky-600 px-4 py-2 font-bold text-lg text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
				>
					Country roads take me home
				</Link>
			</div>
			<div>
				<Logo variant="large" />
			</div>
		</div>
	);
}
