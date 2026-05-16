import { getRouteApi } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { ExternalLinkIcon } from 'lucide-react';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { ActionButtons } from './action-buttons';
import { BioDropdown } from './bio-dropdown';
import { UserTabs as Tabs } from './tabs';

type Props = {
	className?: string;
};

const defaultBanner = 'https://i.imgur.com/EwvUEmR.jpg';

export function Header({ className }: Props) {
	const parentRoute = getRouteApi('/u/$username');
	const { profile, meta } = parentRoute.useLoaderData();
	const isThisUser = meta.isSelf;

	return (
		<div className={cn('', className)}>
			<div className="relative mx-auto">
				<Image
					src={profile.banner ?? defaultBanner}
					alt=""
					className="h-64 w-full rounded-lg object-cover object-center"
					layout="constrained"
					height={256}
					aspectRatio={16 / 9}
					background="auto"
				/>

				<UserImage
					src={ipx(userImage(profile.image), 'w_512')}
					imgClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					fallbackClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					className="absolute inset-x-0 -bottom-16 mx-auto size-32 bg-white ring-4 ring-white md:mx-16"
				/>
			</div>

			<div className="mt-20 flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
				<div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end">
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

					<BioDropdown userId={profile.id} isThisUser={isThisUser} />
				</div>
			</div>

			{profile.bio && (
				<div className="mt-4 text-muted-foreground text-sm">{profile.bio}</div>
			)}

			{profile.website && (
				<a
					href={profile.website}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-2 flex w-fit items-center gap-1 text-primary text-sm hover:underline"
				>
					<ExternalLinkIcon className="size-3" />
					<span>{profile.website}</span>
				</a>
			)}

			<Tabs className="md:max-w-5xl" username={profile.username} />
		</div>
	);
}
