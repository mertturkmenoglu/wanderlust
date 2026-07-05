import type { Outputs } from '@/lib/orpc';

export type UserProfile = Pick<
	Outputs['users']['get']['profile'],
	| 'id'
	| 'name'
	| 'username'
	| 'image'
	| 'banner'
	| 'followersCount'
	| 'followingCount'
>;

export type UserProfileMeta = Outputs['users']['get']['meta'];

export type Props = {
	profile: UserProfile;
	meta?: UserProfileMeta;
	variant?: 'default' | 'item';
	as?: 'div' | 'link';
} & React.HTMLAttributes<HTMLDivElement>;

export type MinimalUserProfile = Pick<
	UserProfile,
	'id' | 'name' | 'username' | 'image'
>;
