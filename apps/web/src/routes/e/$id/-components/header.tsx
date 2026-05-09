import { cn } from '@wanderlust/ui/lib/utils';
import { authClient } from '@/lib/auth';
import { AddToInterestsButton } from './add-to-interests';
import { Menu } from './menu';

type Props = {
	className?: string;
};

export function Header({ className }: Props) {
	// const route = getRouteApi('/p/$id/');
	// const { place } = route.useLoaderData();
	const session = authClient.useSession();
	const isAuth = !!session.data?.user;

	return (
		<div className={cn(className)}>
			<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="line-clamp-2 scroll-m-20 text-3xl capitalize tracking-tight sm:text-4xl">
					Event Name
				</h2>

				<div className="flex w-full items-center justify-between sm:w-auto">
					{isAuth && <AddToInterestsButton />}

					<Menu />
				</div>
			</div>

			<div className="mt-2 ml-auto hidden text-primary text-sm sm:block">
				Event Category
			</div>
		</div>
	);
}
