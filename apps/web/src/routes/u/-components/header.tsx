import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { ExternalLinkIcon } from 'lucide-react';
import { ActionButtons } from './action-buttons';
import { BioDropdown } from './bio-dropdown';
import { HeaderImages } from './header-images';
import { UserTabs as Tabs } from './tabs';

type Props = {
	className?: string;
};

export function Header({ className }: Props) {
	const parentRoute = getRouteApi('/u/$username');
	const { profile } = parentRoute.useLoaderData();

	return (
		<div className={cn(className)}>
			<HeaderImages className="mx-auto" />

			<div className="mt-20 flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
				<div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end">
					<h2 className="flex items-center gap-4 font-semibold text-4xl">
						{profile.name}
					</h2>
					<h3 className="text-lg text-primary">@{profile.username}</h3>
				</div>

				<div className="flex items-start gap-2">
					<ActionButtons />

					<BioDropdown />
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

			<Tabs className="md:max-w-5xl" />
		</div>
	);
}
