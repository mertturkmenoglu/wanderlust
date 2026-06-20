import { Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { authClient } from '@/lib/auth';
import { GradientText } from '../gradient-text';
import { Logo } from '../logo';
import { useIsImpersonating } from './hooks';
import { ImpersonationBanner } from './impersonation-banner';
import { Links } from './links';
import { Menu } from './menu';
import { SignIn } from './sign-in';

type Props = React.HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: Readonly<Props>) {
	const session = authClient.useSession();
	const isSignedIn = useIsAuthenticated();
	const isImpersonating = useIsImpersonating();

	const content = session.isPending ? (
		<div className="h-8 w-16 animate-pulse rounded-full bg-primary" />
	) : (
		<div>
			{!isSignedIn && <SignIn />}

			{isSignedIn && (
				<div className="flex items-center gap-2">
					<Links />
					<Menu />
				</div>
			)}
		</div>
	);

	return (
		<>
			{isImpersonating && (
				<ImpersonationBanner className="mx-auto mt-4 max-w-7xl" />
			)}
			<header
				className={cn(
					'mx-auto mt-8 flex h-10 w-full max-w-7xl items-center justify-between',
					className,
				)}
				{...props}
			>
				<Link to="/" className="flex items-center gap-2">
					<Logo variant="small" />
					<GradientText className="font-bold" text="Wanderlust" />
				</Link>

				{content}
			</header>
		</>
	);
}
