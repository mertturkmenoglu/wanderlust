import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { ExternalLinkIcon, LinkIcon } from 'lucide-react';
import {
	type CreateLinkComponentRenderer,
	type CreateLinkProps,
	createLinkComponent,
} from '@/lib/link';

type Props = CreateLinkProps<{
	text: string;
	external?: boolean;
}>;

const render: CreateLinkComponentRenderer<Props> = (
	{ text, external = false, className, ...props },
	ref,
) => {
	return (
		<a
			ref={ref}
			{...props}
			className={buttonVariants({
				variant: 'link',
				className: cn('', className),
			})}
		>
			<div className="flex items-center gap-2 px-0">
				{external ? (
					<ExternalLinkIcon className="size-4" />
				) : (
					<LinkIcon className="size-4" />
				)}
				<div>{text}</div>
			</div>
		</a>
	);
};

export const DetailLink = createLinkComponent<Props>(render);
