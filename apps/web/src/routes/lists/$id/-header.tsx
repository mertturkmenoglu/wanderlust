import { Link, linkOptions } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { formatDistanceToNow } from 'date-fns';
import { BackLink } from '@/components/back-link';
import { useListQuery } from './-hooks';
import { Menu } from './-menu';

export function Header() {
	const query = useListQuery();
	const { list } = query.data;

	return (
		<>
			<BackLink
				link={linkOptions({
					to: '/lists',
				})}
				text="Go back to lists"
			/>

			<div className="flex items-center justify-between gap-8">
				<div>
					<h2 className="text-2xl tracking-tighter">{list.name}</h2>
					<div className="flex items-baseline gap-2 text-muted-foreground text-xs">
						<Link
							to="/u/$username"
							params={{ username: list.user.username }}
							className={buttonVariants({
								variant: 'link',
								size: 'sm',
								className: 'p-0!',
							})}
						>
							{list.user.name}
						</Link>
						<div title={new Date(list.createdAt).toLocaleString()}>
							{formatDistanceToNow(list.createdAt)} ago
						</div>
					</div>
				</div>

				<Menu />
			</div>
		</>
	);
}
