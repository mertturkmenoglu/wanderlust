import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api, rpc } from '@/lib/api';
import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import clsx from 'clsx';
import { BadgeCheckIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  username: string;
  className?: string;
};

async function getUser(username: string) {
  return rpc(() =>
    api.users[':username'].profile.$get({
      param: {
        username: username,
      },
    })
  );
}

export default async function Bio({ username, className }: Props) {
  const currentUser = await clerkCurrentUser();
  const isThisUser = currentUser?.username === username;
  const { data: user } = await getUser(username);
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className={clsx('', className)}>
      <div className="flex flex-col items-center md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Avatar className="size-24">
            <AvatarImage
              src={user.image ?? ''}
              className="size-24"
            />
            <AvatarFallback>
              <Skeleton className="size-24 rounded-full" />
            </AvatarFallback>
          </Avatar>

          {/* Name + username */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-medium">{fullName}</h2>
            <h3 className="text-base text-primary">@{user.username}</h3>
            {user.isVerified && (
              <div className="mt-2 flex items-center gap-2">
                <BadgeCheckIcon className="size-6 text-primary" />
                <span className="text-sm text-gray-500">Verified</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 md:mt-0 md:flex-row">
          {/* Followers */}
          <div className="flex items-center gap-4">
            <Link
              href={`/user/${username}/followers`}
              className="hover:underline"
            >
              <span>{user.followersCount} </span>
              <span>Followers</span>
            </Link>

            <Link
              href={`/user/${username}/following`}
              className="hover:underline"
            >
              <span>{user.followingCount} </span>
              <span>Following</span>
            </Link>
          </div>

          {/* Action Button */}
          {isThisUser ? (
            <Button
              asChild
              variant="secondary"
            >
              <Link href="/settings">Settings</Link>
            </Button>
          ) : (
            <Button variant="default">Follow</Button>
          )}
        </div>
      </div>

      <div className="my-4 text-center md:mx-28 md:text-left">
        {user.bio && (
          <p className="leading-7 [&:not(:first-child)]:mt-6">{user.bio}</p>
        )}
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {user.website}
          </a>
        )}
        <p>
          {user.isBusinessAccount && (
            <span className="text-primary">Business Account</span>
          )}
        </p>
      </div>

      <hr />
    </div>
  );
}
