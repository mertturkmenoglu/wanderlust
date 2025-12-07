import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';

type Props = {
	type: 'signin' | 'signup';
};

export function AuthLegalText({ type }: Props) {
	return (
		<div className="text-muted-foreground text-sm">
			{type === 'signin'
				? 'By signing in, you agree to our'
				: 'By signing up, you agree to our'}{' '}
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
			.
			<div>
				You also agree that you are not Baran Kandil or an affiliate of him.
			</div>
		</div>
	);
}
