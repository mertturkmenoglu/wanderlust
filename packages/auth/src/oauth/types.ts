export type TUser = {
	email: string;
	image: string;
	name: string;
	username: string;
};

export type TGoogleUser = {
	email: string;
	picture: string;
	name: string;
};

export type TFacebookUser = {
	email?: string | undefined;
	picture: {
		data: {
			url: string;
		};
	};
	name: string;
};
