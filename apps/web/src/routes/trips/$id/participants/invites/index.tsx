import { createFileRoute } from '@tanstack/react-router';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { Content } from './-components/content';
import { Header } from './-components/header';

export const Route = createFileRoute('/trips/$id/participants/invites/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Header />

			<SuspenseWrapper>
				<Content />
			</SuspenseWrapper>
		</div>
	);
}
