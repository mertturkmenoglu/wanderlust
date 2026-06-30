import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import {
	type CreateLinkComponentRenderer,
	type CreateLinkProps,
	createLinkComponent,
} from '@/lib/link';

type Props = CreateLinkProps<{
	text?: string;
}>;

const render: CreateLinkComponentRenderer<Props> = (
	{ text = 'Go back', className, ...props },
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
		>
			<div className="flex items-center gap-2 px-0">
				<ArrowLeftIcon className="size-4" />
				<div>{text}</div>
			</div>
		</a>
	);
};

export const BackLink = createLinkComponent<Props>(render);
