import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { MailsIcon, MapIcon, SearchIcon } from 'lucide-react';
import { z } from 'zod';
import { ErrorComponent } from '@/components/blocks/error-component';
import { CreateDialog } from '@/components/blocks/trips/create-dialog';
import { buttonVariants } from '@/components/ui/button';

const schema = z.object({
	showNewDialog: z.boolean().optional(),
});

export const Route = createFileRoute('/trips/')({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.auth.user) {
			throw redirect({
				to: '/sign-in',
			});
		}
	},
	validateSearch: schema,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	return (
		<div className="flex w-full flex-col items-center justify-center">
			<img src="/trip.png" className="size-64" alt="" />
			<h2 className="mt-8 text-center font-bold text-4xl">
				Plan your next trip with
				<br />
				<span className="bg-linear-to-r from-primary to-sky-600 bg-clip-text text-transparent">
					Wanderlust
				</span>
			</h2>

			<div className="mt-16 grid max-w-md grid-cols-2 gap-2 md:gap-8">
				<CreateDialog />

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
