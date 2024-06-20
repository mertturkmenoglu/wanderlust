'use client';

import AppMessage from '@/components/blocks/AppMessage';
import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import UserCard from '../_components/user-card';

type Props = {
  params: {
    username: string;
  };
};

async function getFollowing(username: string, page: number) {
  return rpc(() =>
    api.users[':username'].following.$get({
      param: {
        username,
      },
      query: { page: `${page}` },
    })
  );
}

export default function Page({ params: { username } }: Props) {
  const query = useInfiniteQuery({
    queryKey: ['following', username],
    queryFn: ({ pageParam }) => getFollowing(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  const isEmpty =
    query.data && query.data.pages.map((page) => page.data.length).at(0) === 0;

  return (
    <div className="mx-auto my-8 max-w-4xl">
      <div className="my-4 text-center text-xl font-semibold">Following</div>
      {query.isLoading && (
        <div className="flex w-full items-center justify-center">
          <ReloadIcon className="size-8 animate-spin" />
        </div>
      )}
      {isEmpty && (
        <AppMessage
          emptyMessage={
            <div className="text-center text-sm">
              This user is not following anyone
            </div>
          }
          showBackButton={false}
        />
      )}
      {query.data && (
        <div className="mx-auto grid max-w-lg grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((user) => (
                <Link
                  href={`/user/${user.following.username}`}
                  key={user.followingId}
                >
                  <UserCard
                    fullName={`${user.following.firstName} ${user.following.lastName}`}
                    username={user.following.username}
                    isVerified={user.following.isVerified}
                    image={user.following.image}
                  />
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
      {query.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => query.fetchNextPage()}
            disabled={!query.hasNextPage || query.isFetchingNextPage}
          >
            {query.isFetchingNextPage
              ? 'Loading more...'
              : query.hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
          </Button>
        </div>
      )}
    </div>
  );
}
