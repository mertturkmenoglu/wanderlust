import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { FieldDescription } from '@wanderlust/ui/components/field';
import { cn } from '@wanderlust/ui/lib/utils';

export function AuthLegalText() {
	return (
		<FieldDescription className="text-center">
			By continuing, you acknowledge our
			<br />
			<Link
				to="/terms"
				className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0')}
			>
				Terms of Service
			</Link>{' '}
			and{' '}
			<Link
				to="/privacy"
				className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0')}
			>
				Privacy Policy
			</Link>
		</FieldDescription>
	);
}
