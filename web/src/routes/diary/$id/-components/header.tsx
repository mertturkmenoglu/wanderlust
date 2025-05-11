import BackLink from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi, Link } from '@tanstack/react-router';
import { PencilIcon } from 'lucide-react';
import { useContext } from 'react';
import SharePopover from './share-popover';

export default function Header() {
  const route = getRouteApi('/diary/$id/');
  const { entry } = route.useLoaderData();
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.id === entry.userId;

  return (
    <>
      <BackLink href="/diary" text="Go back to the diary" />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tighter">{entry.title}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <div>Created by: {isOwner ? 'You' : entry.user.fullName}</div>
            <div className="ml-1">
              at{' '}
              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                dateStyle: 'medium',
              })}
            </div>
          </div>
        </div>

        <div className="space-x-2">
          {isOwner && (
            <>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger tabIndex={-1}>
                    <SharePopover
                      id={entry.id}
                      friendsCount={entry.friends.length}
                      share={entry.shareWithFriends}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Share
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger tabIndex={-1}>
                    <Button asChild variant="ghost" size="icon">
                      <Link
                        to="/diary/$id/edit"
                        params={{
                          id: entry.id,
                        }}
                      >
                        <PencilIcon className="size-4" />
                        <span className="sr-only">Edit diary entry</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Edit
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
    </>
  );
}
