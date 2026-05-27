import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ArrowRightIcon } from 'lucide-react';

export function SignInButton() {
	return (
		<Link to="/sign-in">
			<Button variant="default" asChild>
				<div className="flex items-center gap-2">
					<div>Sign in</div>
					<ArrowRightIcon className="size-4" />
				</div>
			</Button>
		</Link>
	);
}
