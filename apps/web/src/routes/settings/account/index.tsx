import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Input } from '@wanderlust/ui/components/input';
import { Label } from '@wanderlust/ui/components/label';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { useState } from 'react';
import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { authClient } from '@/lib/auth';
import { ChangePasswordForm } from './-change-password';

export const Route = createFileRoute('/settings/account/')({
	component: RouteComponent,
	loader: async () => {
		const accounts = await authClient.listAccounts();

		return {
			accounts,
		};
	},
});

function RouteComponent() {
	const { auth } = Route.useRouteContext();
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const { accounts } = Route.useLoaderData();
	const providers = (accounts.data ?? []).map((acc) => acc.providerId);
	const hasEmailProvider = providers.includes('credential');
	const hasGoogleProvider = providers.includes('google');
	const hasFacebookProvider = providers.includes('facebook');

	return (
		<div>
			<h2 className="font-semibold text-2xl tracking-tight">Account</h2>

			<div className="mt-4 grid grid-cols-3 items-center gap-4">
				<Label htmlFor="email">Email</Label>
				<div className="col-span-2 flex">
					<Input id="name" disabled value={auth.user?.email} />
				</div>

				<Label htmlFor="username">Username</Label>
				<div className="col-span-2 flex">
					<Input id="username" disabled value={auth.user?.username} />
				</div>

				<Label htmlFor="password">Password</Label>
				<div className="col-span-2 flex">
					<Input id="password" disabled value="********" />
					<Button
						variant="link"
						type="button"
						onClick={() => setIsChangePasswordOpen((prev) => !prev)}
						disabled={!hasEmailProvider}
					>
						{hasEmailProvider
							? isChangePasswordOpen
								? 'Hide'
								: 'Change'
							: '(Unavailable)'}
					</Button>
				</div>

				<div />

				{isChangePasswordOpen && <ChangePasswordForm />}

				<Separator className="col-span-full my-4" />

				<Label>Social Logins</Label>
				<div className="col-span-2 flex gap-4">
					<GoogleIcon
						className={cn('size-6', {
							grayscale: !hasGoogleProvider,
						})}
					/>

					<FacebookIcon
						className={cn('size-6', {
							grayscale: !hasFacebookProvider,
						})}
					/>
				</div>
			</div>
		</div>
	);
}
