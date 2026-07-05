import type { MinimalUserProfile, UserProfile } from './types';

export function toProfile(user: MinimalUserProfile): UserProfile {
	return {
		...user,
		banner: null,
		followersCount: 0,
		followingCount: 0,
	};
}
