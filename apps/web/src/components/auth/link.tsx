import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	type CreateLinkComponentRenderer,
	type CreateLinkProps,
	createLinkComponent,
} from '@/lib/link';

type Props = CreateLinkProps<{
	text: string;
}>;

const render: CreateLinkComponentRenderer<Props> = (
	{ text, className, ...props },
	ref,
) => {
	return (
		<a
			ref={ref}
			{...props}
			className={buttonVariants({
				variant: 'link',
				className: cn('px-0 text-sm underline', className),
			})}
		>
			{text}
		</a>
	);
};

export const AuthLink = createLinkComponent<Props>(render);
