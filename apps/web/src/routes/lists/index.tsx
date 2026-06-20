import { createFileRoute } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';
import { Content } from './-content';
import { Header } from './-header';

export const Route = createFileRoute('/lists/')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<Header />

			<Content />
		</div>
	);
}
