import { createFileRoute } from '@tanstack/react-router';
import { ReplyIcon } from 'lucide-react';
import { Comments } from './-comments';
import { NewComment } from './-new';

export const Route = createFileRoute('/trips/$id/comments/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="flex items-center">
        <ReplyIcon className="size-5 mr-2" />
        <div className="font-medium">Comments</div>
      </div>

      <NewComment className="mt-4" />

      <Comments className="mt-8" />
    </div>
  );
}
