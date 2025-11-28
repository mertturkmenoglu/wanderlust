import type { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	error?: FieldError;
};

export function InputError({ error, className, ...props }: Props) {
	if (error === undefined) {
		return null;
	}

	return (
		<div className={cn('mt-1 text-red-500 text-xs', className)} {...props}>
			{error.message}
		</div>
	);
}
