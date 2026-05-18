import { createFileRoute } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { useLayoutEffect } from 'react';
import { z } from 'zod';
import { AppMessage } from '@/components/app-message';
import { PlaceCard } from '@/components/place-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { authGuard } from '@/lib/auth';
import { Actions } from './-actions';
import { BookmarksContextProvider, useBookmarksContext } from './-context';
import { BookmarkItem } from './-item';
import { BookmarkItemMap } from './-map';
import { Navigation } from './-navigation';

const bookmarksSearchSchema = z.object({
	page: z.number().min(1).max(100).default(1).catch(1),
	pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
});

export const Route = createFileRoute('/bookmarks/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context, deps: { search } }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.bookmarks.list.queryOptions({
				input: {
					page: search.page,
					pageSize: search.pageSize,
				},
			}),
		);
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
	const { bookmarks, pagination } = Route.useLoaderData();
	const ctx = useBookmarksContext();

	useLayoutEffect(() => {
		ctx.setIndex(0);
	}, [ctx.setIndex]);

	if (bookmarks.length === 0) {
		return (
			<AppMessage
				emptyMessage="You have no bookmarks."
				showBackButton={false}
			/>
		);
	}

	const bookmark = bookmarks[ctx.index];

	if (!bookmark) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
				<PlaceCard place={bookmark.place} />

				<Actions bookmark={bookmark} />

				<BookmarkItemMap bookmark={bookmark} />
			</div>
		</div>
	);
}
