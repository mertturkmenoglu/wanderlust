import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { MailsIcon, MapIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { ErrorComponent } from '@/components/error-component';
import { GradientText } from '@/components/gradient-text';
import { authGuard } from '@/lib/auth';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/trips/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	errorComponent: ErrorComponent,
	head: () =>
		seo({
			title: 'Trips',
		}),
});

function RouteComponent() {
	return (
		<div className="flex w-full flex-col items-center justify-center">
			<Image
				src="/trip.png"
				className="size-32 md:size-64"
				alt=""
				layout="constrained"
				width={256}
				aspectRatio={1}
			/>
			<h2 className="mt-8 text-center font-bold text-2xl md:text-4xl">
				Plan your next trip with
				<br />
				<GradientText text="Wanderlust" />
			</h2>

			<div className="mt-16 grid max-w-md grid-cols-2 gap-2 md:gap-8">
				<Link
					to="/trips/new"
					className={buttonVariants({
						variant: 'ghost',
						size: 'lg',
					})}
				>
					<PlusIcon />
					Create Trip
				</Link>

				<Link
					to="/trips/my-trips"
					className={buttonVariants({
						variant: 'ghost',
						size: 'lg',
					})}
				>
					<MapIcon />
					My Trips
				</Link>

				<Link
					to="/trips/discover"
					className={buttonVariants({
						variant: 'ghost',
						size: 'lg',
					})}
				>
					<SearchIcon />
					Discover
				</Link>

				<Link
					to="/trips/invites"
					className={buttonVariants({
						variant: 'ghost',
						size: 'lg',
					})}
				>
					<MailsIcon />
					Invites
				</Link>
			</div>
		</div>
	);
}
