import { createFileRoute } from '@tanstack/react-router';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { authGuard } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { Content } from './-content';
import { BookmarksContextProvider } from './-context';
import { bookmarksSearchSchema } from './-hooks';

export const Route = createFileRoute('/bookmarks/')({
	component: RouteComponent,
	validateSearch: bookmarksSearchSchema,
	loaderDeps: ({ search }) => ({ search }),
	ssr: false,
	beforeLoad: authGuard,
	loader: ({ context, deps: { search } }) => {
		context.queryClient.prefetchQuery(
			orpc.bookmarks.list.queryOptions({
				input: {
					page: search.page,
					pageSize: search.pageSize,
				},
			}),
		);
	},
	head: () =>
		seo({
			title: 'Bookmarks',
		}),
});

function RouteComponent() {
	return (
		<BookmarksContextProvider>
			<div className="mx-auto my-8 w-full max-w-7xl">
				<h2 className="text-2xl">Your Bookmarks</h2>
				<SuspenseWrapper>
					<div className="my-4">
						<Content />
					</div>
				</SuspenseWrapper>
			</div>
		</BookmarksContextProvider>
	);
}
