import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	type CreateLinkComponentRenderer,
	type CreateLinkProps,
	createLinkComponent,
} from '@/lib/link';

type Props = CreateLinkProps<object>;

const render: CreateLinkComponentRenderer<Props> = (
	{ className, ...props },
	ref,
) => {
	return (
		<a
			ref={ref}
			{...props}
			className={buttonVariants({
				variant: 'link',
				className: cn('px-0!', className),
			})}
		/>
	);
};

export const UnderlineLink = createLinkComponent(render);
