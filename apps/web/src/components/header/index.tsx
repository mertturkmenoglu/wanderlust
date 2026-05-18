import { Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { authClient } from '@/lib/auth';
import { Logo } from '../logo';
import { Menu } from './menu';
import { SignInButton } from './sign-in-button';
import { SignedInLinks } from './signed-in';

type Props = React.HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: Readonly<Props>) {
	const session = authClient.useSession();
	const isSignedIn = !session.isPending && session.data?.user;

	return (
		<header
			className={cn(
				'mx-auto mt-8 flex w-full max-w-7xl items-center justify-between',
				className,
			)}
			{...props}
		>
			<Link to="/" className="flex items-center gap-2">
				<Logo variant="small" />
				<span className="bg-linear-to-r from-primary to-sky-600 bg-clip-text font-bold text-transparent">
					Wanderlust
				</span>
			</Link>

			{session.isPending ? (
				<div className="h-8 w-16 animate-pulse rounded-full bg-primary" />
			) : (
				<div>
					{!isSignedIn && <SignInButton />}

					{isSignedIn && session.data?.user && (
						<div className="flex items-center gap-2">
							<SignedInLinks />
							<Menu />
						</div>
					)}
				</div>
			)}
		</header>
	);
}
