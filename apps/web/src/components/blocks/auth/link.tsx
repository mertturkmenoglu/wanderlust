import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
	href: string;
	text: string;
	className?: string;
};

export function AuthLink({ href, text, className }: Readonly<Props>) {
	return (
		<Button
			asChild
			variant="link"
			className={cn('px-0 text-sm underline', className)}
		>
			<Link to={href}>{text}</Link>
		</Button>
	);
}
