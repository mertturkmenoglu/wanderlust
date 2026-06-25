import { createFileRoute } from '@tanstack/react-router';
import { CommentList } from './-list';
import { NewCommentForm } from './-new';

export const Route = createFileRoute('/trips/$id/comments/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto mt-4 max-w-xl">
			<NewCommentForm className="mt-8" />

			<CommentList className="mt-8" />
		</div>
	);
}
