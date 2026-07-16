import type { LinkOptions } from '@tanstack/react-router';
import type { LogoProps } from '../logo';

export type BackLink = LinkOptions & {
	text: string;
};

export type Props = {
	classNames?: Partial<{
		root: string;
		logo: string;
		error: string;
		success: string;
		empty: string;
		backLink: string;
	}>;
	error?: React.ReactNode;
	success?: React.ReactNode;
	empty?: React.ReactNode;
	backLink?: BackLink | false;
	logoProps?: Partial<LogoProps>;
};

export type Variant = 'error' | 'success' | 'empty';
