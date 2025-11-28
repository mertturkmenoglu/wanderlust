import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  className?: string;
};

export function NewComment({ className }: Props) {
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
    <div className={cn(className)}>
      <Label className="text-xs">New Comment</Label>
      <div className="flex gap-2 mt-1">
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
          disabled={content.length === 0}
        >
          <span className="sr-only">Comment</span>
          <SendHorizonalIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
