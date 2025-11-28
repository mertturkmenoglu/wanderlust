/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';
import { AppMessage } from '@/components/blocks/app-message';
import { PlaceCard } from '@/components/blocks/place-card';
import { SuspenseWrapper } from '@/components/blocks/suspense-wrapper';
import { ItemGroup } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { Actions } from './-actions';
import { BookmarksContextProvider, useBookmarksContext } from './-context';
import { useBookmarksQuery } from './-hooks';
import { BookmarkItem } from './-item';
import { BookmarkItemMap } from './-map';
import { Navigation } from './-navigation';

const bookmarksSearchSchema = z.object({
	page: z.number().min(1).max(100).default(1).catch(1),
	pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
});

export const Route = createFileRoute('/bookmarks/')({
	component: RouteComponent,
	beforeLoad: ({ context: { auth } }) => {
		if (!auth.user) {
			throw redirect({
				to: '/sign-in',
			});
		}
	},
	validateSearch: bookmarksSearchSchema,
});

function RouteComponent() {
	return (
		<BookmarksContextProvider>
			<div className="mx-auto my-8 max-w-7xl">
				<h2 className="text-2xl">Your Bookmarks</h2>
				<SuspenseWrapper>
					<div className="my-4">
						<Bookmarks />
					</div>
				</SuspenseWrapper>
			</div>
		</BookmarksContextProvider>
	);
}

function Bookmarks() {
	const query = useBookmarksQuery();
	const ctx = useBookmarksContext();

	useEffect(() => {
		ctx.setIndex(0);
	}, [ctx.setIndex]);

	if (query.error) {
		return (
			<AppMessage
				errorMessage={query.error.title ?? 'Something went wrong'}
				showBackButton={false}
			/>
		);
	}

	if (query.data) {
		if (query.data.bookmarks.length === 0) {
			return (
				<AppMessage
					emptyMessage="You have no bookmarks."
					showBackButton={false}
				/>
			);
		}

		const { bookmarks, pagination } = query.data;

		return (
			<div className="grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
				<ItemGroup className="gap-2">
					{bookmarks.map((bookmark, i) => (
						<BookmarkItem
							key={bookmark.placeId}
							bookmark={bookmark}
							itemIndex={i}
						/>
					))}

					<div className="col-span-full mt-4 flex justify-center">
						<Navigation
							totalPages={pagination.totalPages}
							hasPrevious={pagination.hasPrevious}
							hasNext={pagination.hasNext}
						/>
					</div>
				</ItemGroup>

				<div className="hidden md:block">
					<PlaceCard place={bookmarks[ctx.index]!.place} hoverEffects={false} />

					<Actions bookmark={bookmarks[ctx.index]!} />

					<BookmarkItemMap bookmark={bookmarks[ctx.index]!} />
				</div>
			</div>
		);
	}

	return <Spinner className="mx-auto my-16 size-12 text-primary" />;
}
