import { createFileRoute } from '@tanstack/react-router';
import { WipComponent } from '@/components/wip';
import { authGuard } from '@/lib/auth';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/chat/')({
	component: RouteComponent,
	ssr: false,
	beforeLoad: authGuard,
	head: () =>
		seo({
			title: 'Chat',
		}),
});

function RouteComponent() {
	return <WipComponent />;
}
