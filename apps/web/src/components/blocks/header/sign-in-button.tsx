import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeatureFlags } from '@/providers/flags-provider';

export function SignInButton() {
	const flags = useFeatureFlags();
	const isRedirectToWip = flags['redirect-to-wip'] === true;

	if (isRedirectToWip) {
		return null;
	}

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
