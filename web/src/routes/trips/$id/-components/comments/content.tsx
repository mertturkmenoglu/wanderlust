import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { getRouteApi } from '@tanstack/react-router';
import { SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Results } from './results';

export function Content() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const [content, setContent] = useState('');
  const invalidator = useInvalidator();

  const createCommentMutation = api.useMutation(
    'post',
    '/api/v2/trips/{id}/comments/',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Comment created successfully');
        setContent('');
      },
    },
  );

  return (
    <>
      <div>
        <Label className="text-xs">New Comment</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add a comment"
            className="w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variant="default"
            size="icon"
            onClick={() => {
              createCommentMutation.mutate({
                params: {
                  path: {
                    id: trip.id,
                  },
                },
                body: {
                  content,
                },
              });
            }}
            disabled={!content.length}
          >
            <span className="sr-only">Comment</span>
            <SendHorizonalIcon className="size-4" />
          </Button>
        </div>
      </div>

      <Results />
    </>
  );
}
