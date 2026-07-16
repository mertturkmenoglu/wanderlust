import { generateUsernameFromEmail } from '../username';
import type { TFacebookUser, TGoogleUser, TUser } from './types';

export function mapGoogleProfileToUser(profile: TGoogleUser): TUser {
	return {
		email: profile.email,
		image: profile.picture,
		name: profile.name,
		username: generateUsernameFromEmail(profile.email),
	};
}

export function mapFacebookProfileToUser(profile: TFacebookUser): TUser {
	return {
		email: profile.email ?? '',
		image: profile.picture.data.url,
		name: profile.name,
		username: generateUsernameFromEmail(profile.email ?? ''),
	};
}
