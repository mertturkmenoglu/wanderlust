import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignInButton() {
	return (
		<Link to="/sign-in">
			<Button variant="default" className="" asChild>
				<div className="flex items-center gap-2">
					<div>Sign in</div>
					<ArrowRightIcon className="size-4" />
				</div>
			</Button>
		</Link>
	);
}
