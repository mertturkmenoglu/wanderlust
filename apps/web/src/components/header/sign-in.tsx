import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ArrowRightIcon } from 'lucide-react';

export function SignIn() {
	return (
		<Link to="/sign-in" className={buttonVariants({ variant: 'default' })}>
			<span>Sign in</span>
			<ArrowRightIcon />
		</Link>
	);
}
