import { Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { authClient } from '@/lib/auth';
import { GradientText } from '../gradient-text';
import { Logo } from '../logo';
import { useIsImpersonating } from './hooks';
import { ImpersonationBanner } from './impersonation-banner';
import { Menu } from './menu';
import { SignInButton } from './sign-in-button';
import { SignedInLinks } from './signed-in';

type Props = React.HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: Readonly<Props>) {
	const session = authClient.useSession();
	const isSignedIn = useIsAuthenticated();
	const isImpersonating = useIsImpersonating();

	return (
		<>
			{isImpersonating && (
				<ImpersonationBanner className="mx-auto mt-4 max-w-7xl" />
			)}
			<header
				className={cn(
					'mx-auto mt-8 flex w-full max-w-7xl items-center justify-between',
					className,
				)}
				{...props}
			>
				<Link to="/" className="flex items-center gap-2">
					<Logo variant="small" />
					<GradientText className="font-bold" text="Wanderlust" />
				</Link>

				{session.isPending ? (
					<div className="h-8 w-16 animate-pulse rounded-full bg-primary" />
				) : (
					<div>
						{!isSignedIn && <SignInButton />}

						{isSignedIn && (
							<div className="flex items-center gap-2">
								<SignedInLinks />
								<Menu />
							</div>
						)}
					</div>
				)}
			</header>
		</>
	);
}
