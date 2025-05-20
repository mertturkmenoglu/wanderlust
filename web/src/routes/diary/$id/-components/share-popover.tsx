import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { GlobeIcon, LockIcon, Share2Icon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  id: string;
  share: boolean;
  friendsCount: number;
};

export default function SharePopover({ id, share, friendsCount }: Props) {
  const friendsCountText = friendsCount === 1 ? 'friend' : 'friends';
  const invalidator = useInvalidator();

  const shareMutation = api.useMutation('patch', '/api/v2/diary/{id}/sharing', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Share settings updated');
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Share2Icon className="size-4" />
          <span className="sr-only">Change share settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-w-96"
      >
        <div className="flex items-center gap-2">
          {share ? (
            <GlobeIcon className="size-6 text-primary" />
          ) : (
            <LockIcon className="size-6 text-primary" />
          )}
          <div className="ml-2">
            <div className="text-sm">Share with friends</div>
            <div className="text-muted-foreground text-xs">
              {share ? 'Sharing' : 'Private'}
            </div>
          </div>
          <Switch
            className="ml-auto"
            checked={share}
            onCheckedChange={() => {
              shareMutation.mutate({
                params: {
                  path: {
                    id,
                  },
                },
              });
            }}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          You {share ? 'are sharing' : 'can share'} with {friendsCount}{' '}
          {friendsCountText}.
        </div>
      </PopoverContent>
    </Popover>
  );
}
