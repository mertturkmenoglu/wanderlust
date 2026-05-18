import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { Grid2X2Icon, TextAlignJustifyIcon } from 'lucide-react';
import { PlaceCard } from '@/components/place-card';
import { useListContext } from './-context';

export function Items() {
	const { list } = useLoaderData({ from: '/lists/$id/' });
	const ctx = useListContext();

	return (
		<div>
			<ButtonGroup className="ml-auto">
				<Button
					onClick={() => ctx.setView('list')}
					variant={ctx.view === 'list' ? 'default' : 'outline'}
				>
					<TextAlignJustifyIcon />
					<span>List</span>
				</Button>
				<Button
					onClick={() => ctx.setView('grid')}
					variant={ctx.view === 'grid' ? 'default' : 'outline'}
				>
					<Grid2X2Icon />
					<span>Grid</span>
				</Button>
			</ButtonGroup>
			{ctx.view === 'grid' && (
				<div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{list.items.map((listItem) => (
						<Link
							to="/p/$id"
							params={{
								id: listItem.placeId,
							}}
							key={listItem.placeId}
						>
							<PlaceCard place={listItem.place} />
						</Link>
					))}
				</div>
			)}
			{ctx.view === 'list' && (
				<div className="mt-2 grid grid-cols-1 gap-4">
					{list.items.map((listItem) => (
						<Link
							to="/p/$id"
							params={{
								id: listItem.placeId,
							}}
							key={listItem.placeId}
						>
							<PlaceCard place={listItem.place} variant="item" />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
