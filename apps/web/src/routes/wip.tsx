import { createFileRoute } from '@tanstack/react-router';
import { WipComponent } from '@/components/wip';

export const Route = createFileRoute('/wip')({
	component: RouteComponent,
});

function RouteComponent() {
	return <WipComponent />;
}
