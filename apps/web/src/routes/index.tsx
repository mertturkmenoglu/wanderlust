import { createFileRoute } from '@tanstack/react-router';
import { Search } from '@/components/search';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { Content } from './-components/content';

export const Route = createFileRoute('/')({
	component: App,
	ssr: false,
});

function App() {
	return (
		<div className="mx-auto w-full max-w-7xl">
			<Search className="md:md-24 mt-8" variant="global" />

			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
}
