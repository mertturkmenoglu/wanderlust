import { createFileRoute } from '@tanstack/react-router';
import {
	FieldDescription,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';

export const Route = createFileRoute('/settings/chat/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<FieldSet>
			<FieldLegend className="text-xl!">Chat</FieldLegend>
			<FieldDescription>Change your chat settings</FieldDescription>

			<FieldSeparator />

			<div>Work in progress...</div>
		</FieldSet>
	);
}
