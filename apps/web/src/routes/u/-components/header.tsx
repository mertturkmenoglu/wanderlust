import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { ActionButtons } from './action-buttons';
import { BioDropdown } from './bio-dropdown';
import { UserTabs as Tabs } from './tabs';

type Props = {
	className?: string;
};

export function Header({ className }: Props) {
	const parentRoute = getRouteApi('/u/$username');
	const { profile, meta } = parentRoute.useLoaderData();
	const isThisUser = meta.isSelf;

	return (
		<div className={cn('', className)}>
			<div className="relative mx-auto">
				<img
					src={profile.banner ?? 'https://i.imgur.com/EwvUEmR.jpg'}
					alt="banner"
					className="h-64 w-full rounded-lg object-cover object-center"
				/>

				<UserImage
					src={ipx(userImage(profile.image), 'w_512')}
					imgClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					fallbackClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					className="-bottom-16 absolute inset-x-0 mx-auto size-32 bg-white ring-4 ring-white sm:mx-16"
				/>
			</div>

			<div className="mt-20 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
				<div className="flex flex-col items-center text-center sm:items-start">
					<h2 className="flex items-center gap-4 font-semibold text-4xl">
						{profile.name}
					</h2>
					<h3 className="text-lg text-primary">@{profile.username}</h3>
				</div>

				<div className="flex items-start gap-2">
					<ActionButtons
						loading={false}
						isThisUser={isThisUser}
						isFollowing={meta.isFollowing}
						username={profile.username}
					/>

					<BioDropdown userId={profile.id} />
				</div>
			</div>

			{profile.bio && (
				<div className="mt-4 text-muted-foreground text-sm">{profile.bio}</div>
			)}

			<Tabs className="md:max-w-5xl" username={profile.username} />
		</div>
	);
}
