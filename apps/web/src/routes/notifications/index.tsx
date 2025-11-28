import { createFileRoute } from '@tanstack/react-router';
import { WipComponent } from '@/components/blocks/wip';

export const Route = createFileRoute('/notifications/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <WipComponent />;
}
