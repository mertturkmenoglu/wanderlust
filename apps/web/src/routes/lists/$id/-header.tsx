import { BackLink } from '@/components/back-link';
import { RelativeTime } from '@/components/relative-time';
import { UnderlineLink } from '@/components/underline-link';
import { ChangeView } from './-change-view';
import { useListQuery } from './-hooks';
import { Menu } from './-menu';

export function Header() {
	const query = useListQuery();
	const { list } = query.data;

	return (
		<>
			<BackLink to="/lists" text="Go back to lists" />

			<div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
				<div>
					<h2 className="text-2xl tracking-tighter">{list.name}</h2>
					<div className="flex items-baseline gap-2 text-muted-foreground text-sm">
						<UnderlineLink
							to="/u/$username"
							params={{
								username: list.user.username,
							}}
						>
							{list.user.name}
						</UnderlineLink>
						&mdash;
						<RelativeTime date={list.createdAt} />
					</div>
				</div>

				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center justify-end gap-4">
						<span className="sr-only text-muted-foreground text-sm md:not-sr-only">
							{list.items.length} items
						</span>
						<ChangeView />
					</div>
					<Menu />
				</div>
			</div>
		</>
	);
}
