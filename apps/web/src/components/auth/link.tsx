import { Link, type LinkOptions } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';

type Props = {
	link: LinkOptions;
	text: string;
	className?: string;
};

export function AuthLink({ link, text, className }: Readonly<Props>) {
	return (
		<Button
			asChild
			variant="link"
			className={cn('px-0 text-sm underline', className)}
		>
			<Link {...link}>{text}</Link>
		</Button>
	);
}
