import { createFileRoute } from '@tanstack/react-router';
import { WipComponent } from '@/components/blocks/wip';

export const Route = createFileRoute('/trips/discover/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<WipComponent />
		</div>
	);
}
