import { linkOptions } from '@tanstack/react-router';
import {
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	BellIcon,
	BookmarkIcon,
	CircleHelpIcon,
	ListIcon,
	LockIcon,
	MapIcon,
	ScaleIcon,
	Settings2Icon,
	SunMoonIcon,
	UserIcon,
	UserKeyIcon,
	UsersIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useUpdatePreferences } from '@/hooks/use-update-preferences';
import { usePreferencesStore } from '@/stores/preferences-context';
import { useShortName } from './hooks';
import { MenuItem } from './item';
import { SignOut } from './sign-out';

type Props = {
	fullName: string;
	username: string;
};

const getItems = (username: string) => ({
	profile: {
		link: linkOptions({
			to: '/u/$username',
			params: {
				username,
			},
		}),
		icon: UserIcon,
		text: 'Profile',
	},
	notifications: {
		link: linkOptions({
			to: '/notifications',
		}),
		icon: BellIcon,
		text: 'Notifications',
	},
	settings: {
		link: linkOptions({
			to: '/settings',
		}),
		icon: Settings2Icon,
		text: 'Settings',
	},
	trips: {
		link: linkOptions({
			to: '/trips',
		}),
		icon: MapIcon,
		text: 'Trips',
	},
	friends: {
		link: linkOptions({
			to: '/u/$username/following',
			params: {
				username,
			},
		}),
		icon: UsersIcon,
		text: 'Friends',
	},
	bookmarks: {
		link: linkOptions({
			to: '/bookmarks',
		}),
		icon: BookmarkIcon,
		text: 'Bookmarks',
	},
	lists: {
		link: linkOptions({
			to: '/lists',
		}),
		icon: ListIcon,
		text: 'Lists',
	},
	help: {
		link: linkOptions({
			to: '/help',
		}),
		icon: CircleHelpIcon,
		text: 'Help',
	},
	privacy: {
		link: linkOptions({
			to: '/privacy',
		}),
		icon: LockIcon,
		text: 'Privacy',
	},
	terms: {
		link: linkOptions({
			to: '/terms',
		}),
		icon: ScaleIcon,
		text: 'Terms',
	},
	changeAccounts: {
		link: linkOptions({
			to: '/change-accounts',
		}),
		icon: UserKeyIcon,
		text: 'Change Accounts',
	},
});

export function Content({ fullName, username }: Readonly<Props>) {
	const shortName = useShortName(fullName, 25);
	const items = getItems(username);
	const { setTheme } = useTheme();
	const theme = usePreferencesStore((state) => state.preferences.theme);
	const mutation = useUpdatePreferences();

	return (
		<DropdownMenuContent className="w-56" align="end">
			<DropdownMenuLabel>{shortName}</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuGroup>
				<MenuItem {...items.profile} />

				<MenuItem {...items.notifications} />

				<MenuItem {...items.settings} />

				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="gap-4">
						<SunMoonIcon />
						<span>Change Theme</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuLabel>Change Theme</DropdownMenuLabel>
							<DropdownMenuCheckboxItem
								checked={theme === 'light'}
								onCheckedChange={(checked) => {
									if (!checked) {
										return;
									}

									mutation.mutate(
										{
											theme: 'light',
										},
										{
											onSuccess: () => {
												setTheme('light');
											},
										},
									);
								}}
							>
								<span>Light</span>
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={theme === 'dark'}
								onCheckedChange={(checked) => {
									if (!checked) {
										return;
									}

									mutation.mutate(
										{
											theme: 'dark',
										},
										{
											onSuccess: () => {
												setTheme('dark');
											},
										},
									);
								}}
							>
								<span>Dark</span>
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={theme === 'auto'}
								onCheckedChange={(checked) => {
									if (!checked) {
										return;
									}

									mutation.mutate(
										{
											theme: 'auto',
										},
										{
											onSuccess: () => {
												setTheme('auto');
											},
										},
									);
								}}
							>
								<span>Auto</span>
							</DropdownMenuCheckboxItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuGroup>

			<DropdownMenuSeparator />

			<DropdownMenuGroup>
				<MenuItem {...items.trips} />

				<MenuItem {...items.friends} />

				<MenuItem {...items.bookmarks} />

				<MenuItem {...items.lists} />
			</DropdownMenuGroup>

			<DropdownMenuSeparator />

			<DropdownMenuGroup>
				<MenuItem {...items.help} />

				<MenuItem {...items.privacy} />

				<MenuItem {...items.terms} />
			</DropdownMenuGroup>

			<DropdownMenuSeparator />

			<DropdownMenuGroup>
				<MenuItem {...items.changeAccounts} />

				<SignOut />
			</DropdownMenuGroup>
		</DropdownMenuContent>
	);
}
