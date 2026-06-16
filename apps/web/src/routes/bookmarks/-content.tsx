import { ItemGroup } from '@wanderlust/ui/components/item';
import { AppMessage } from '@/components/app-message';
import { PlaceCard } from '@/components/place-card';
import { Actions } from './-actions';
import { useBookmarksContext } from './-context';
import { useBookmarksQuery } from './-hooks';
import { BookmarkItem } from './-item';
import { BookmarkItemMap } from './-map';
import { Navigation } from './-navigation';

export function Content() {
	const {
		data: { bookmarks },
	} = useBookmarksQuery();
	const ctx = useBookmarksContext();

	if (bookmarks.length === 0) {
		return <AppMessage empty="You have no bookmarks." />;
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
					<Navigation />
				</div>
			</ItemGroup>

			<div className="hidden md:block">
				<PlaceCard place={bookmark.place} className="w-full" />

				<Actions bookmark={bookmark} />

				<BookmarkItemMap bookmark={bookmark} />
			</div>
		</div>
	);
}
