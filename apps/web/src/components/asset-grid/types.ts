export type Props = {
	className?: string;
	assets: Array<{
		id: number;
		url: string;
		description: string | null;
		order: number;
	}>;
};
