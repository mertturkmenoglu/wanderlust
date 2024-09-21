import UserImage from '@/components/blocks/user-image';
import { getUserByUsername } from '@/lib/api';
import { getAuth } from '@/lib/auth';
import clsx from 'clsx';
import ActionButtons from './action-buttons';
import Banner from './banner';
import BioDropdown from './bio-dropdown';
import Followers from './followers';
import Info from './info';
import Pronouns from './pronouns';
import Verified from './verified';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  username: string;
  className?: string;
};

export default async function Bio({ username, className }: Props) {
  const currentUser = await getAuth();
  const isThisUser = currentUser?.data?.username === username;
  const { data: user } = await getUserByUsername(username);

  return (
    <div className={clsx('mx-auto max-w-4xl', className)}>
      <Banner>
        <UserImage
          src={user.profileImage}
          imgClassName="size-16 bottom-10 left-8 ring-4 ring-white md:bottom-16"
          fallbackClassName="size-16 bottom-10 left-8 ring-4 ring-white md:bottom-16"
          className=""
        />

        <div className="absolute bottom-10 right-4 flex gap-4 md:bottom-16 md:right-8">
          <ActionButtons
            isThisUser={isThisUser}
            isFollowing={false} // TODO: Update later
            username={username}
          />

          <BioDropdown userId={user.id} />
        </div>
      </Banner>

      <div className="-mt-8 flex flex-col justify-between md:flex-row">
        <div className="">
          <h2 className="text-2xl font-semibold">{user.fullName}</h2>
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
        <div className="font-semibold">About {user.fullName}</div>
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
