import { createFileRoute } from '@tanstack/react-router';
import { ReplyIcon } from 'lucide-react';
import { Comments } from './-comments';
import { NewComment } from './-new';

export const Route = createFileRoute('/trips/$id/comments/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mt-4">
			<div className="flex items-center">
				<ReplyIcon className="mr-2 size-5" />
				<div className="font-medium">Comments</div>
			</div>

			<NewComment className="mt-4" />

			<Comments className="mt-8" />
		</div>
	);
}
