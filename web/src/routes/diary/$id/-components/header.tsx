import { BackLink } from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Settings2Icon } from 'lucide-react';
import { useContext } from 'react';

export function Header() {
  const route = getRouteApi('/diary/$id/');
  const { diary } = route.useLoaderData();
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.id === diary.userId;

  return (
    <>
      <BackLink
        href="/diary"
        text="Go back to the diary"
      />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tighter">{diary.title}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <div>Created by {isOwner ? 'You' : diary.user.fullName}</div>
            <div className="ml-1">
              at{' '}
              {new Date(diary.createdAt).toLocaleDateString('en-US', {
                dateStyle: 'medium',
              })}
            </div>
          </div>
        </div>

        <div className="space-x-2">
          {isOwner && (
            <Button
              asChild
              variant="ghost"
              size="default"
            >
              <Link
                to="/diary/$id/edit"
                params={{
                  id: diary.id,
                }}
              >
                <Settings2Icon className="size-4" />
                <span>Edit</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
