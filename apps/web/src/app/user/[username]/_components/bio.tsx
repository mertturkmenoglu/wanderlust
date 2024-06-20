import { api, rpc } from '@/lib/api';
import { getAuthHeader } from '@/lib/headers';
import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import clsx from 'clsx';
import ActionButtons from './action-buttons';
import Banner from './banner';
import BioDropdown from './bio-dropdown';
import Followers from './followers';
import Info from './info';
import Pronouns from './pronouns';
import UserImage from './user-image';
import Verified from './verified';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  username: string;
  className?: string;
};

export async function getUser(username: string) {
  return rpc(() =>
    api.users[':username'].profile.$get(
      {
        param: {
          username,
        },
      },
      {
        ...getAuthHeader(),
      }
    )
  );
}

export default async function Bio({ username, className }: Props) {
  const currentUser = await clerkCurrentUser();
  const isThisUser = currentUser?.username === username;
  const { data: user, metadata } = await getUser(username);
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className={clsx('mx-auto max-w-4xl', className)}>
      <Banner>
        <UserImage
          image={user.image}
          className="bottom-10 left-8 ring-4 ring-white md:bottom-16"
        />

        <div className="absolute bottom-10 right-4 flex gap-4 md:bottom-16 md:right-8">
          <ActionButtons
            isThisUser={isThisUser}
            isFollowing={metadata.isFollowing}
            username={username}
          />

          <BioDropdown userId={user.id} />
        </div>
      </Banner>

      <div className="-mt-8 flex flex-col justify-between md:flex-row">
        <div className="">
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          <h3 className="text-base text-primary">@{user.username}</h3>
          {user.isVerified && <Verified />}
        </div>

        <Followers
          username={user.username}
          followersCount={user.followersCount}
          followingCount={user.followingCount}
          className="-ml-4"
        />
      </div>

      <hr className="my-4 hidden md:block" />

      <div className="flex items-center gap-4">
        <div className="font-semibold">About {user.firstName}</div>
        {user.pronouns !== null && <Pronouns pronouns={user.pronouns} />}
      </div>
      <Info
        bio={user.bio}
        website={user.website}
        isBusinessAccount={user.isBusinessAccount}
        className="my-4"
      />
    </div>
  );
}
