import { createContext, useContext } from 'react';
import type { UserProfile, UserProfileMeta } from './types';

type State = {
	profile: UserProfile;
	meta?: UserProfileMeta;
};

export const UserCardContext = createContext<State | null>(null);

type Props = React.PropsWithChildren & {
	profile: UserProfile;
	meta?: UserProfileMeta;
};

export function UserCardContextProvider({ children, profile, meta }: Props) {
	return (
		<UserCardContext.Provider
			value={{
				profile,
				meta,
			}}
		>
			{children}
		</UserCardContext.Provider>
	);
}

export function useUserCardContext() {
	const context = useContext(UserCardContext);

	if (!context) {
		throw new Error(
			'useUserCardContext must be used within a UserCardContextProvider',
		);
	}

	return context;
}
