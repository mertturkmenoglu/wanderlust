import { createFileRoute } from '@tanstack/react-router';
import { Search } from '@/components/search';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { TagNavigation } from '@/components/tag-navigation';
import { Banner } from './-components/banner';
import { Content } from './-components/content';

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	return (
		<div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-4 md:gap-8">
			<Search />

			<TagNavigation />

			<Banner />

			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
}
