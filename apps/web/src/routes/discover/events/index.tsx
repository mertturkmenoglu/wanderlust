import { createFileRoute } from '@tanstack/react-router';
import { WipComponent } from '@/components/blocks/wip';

export const Route = createFileRoute('/discover/events/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <WipComponent />;
}
