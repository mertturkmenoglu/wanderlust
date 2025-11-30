import { Link } from '@tanstack/react-router';
import { authClient } from '@/lib/auth';
import { cn } from '@/lib/utils';
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
			<Link to="/" className="flex items-center gap-4">
				<img
					src="/logo.png"
					alt="Wanderlust"
					className="size-12 min-h-12 min-w-12"
				/>
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
