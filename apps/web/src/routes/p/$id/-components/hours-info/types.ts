export type TOpeningHours = {
	regular: {
		day: string;
		intervals: {
			off: boolean;
			open: string;
			close: string;
		}[];
	}[];
	special: {
		rule: string;
		intervals: {
			off: boolean;
			open: string;
			close: string;
		}[];
	}[];
};
