import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useFeatureFlags } from '@/providers/flags-provider';
import { ChangePasswordForm } from './-change-password';

export const Route = createFileRoute('/settings/account/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { auth } = Route.useRouteContext();
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const flags = useFeatureFlags();

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
					>
						{isChangePasswordOpen ? 'Hide' : 'Change'}
					</Button>
				</div>

				<div />

				{isChangePasswordOpen && <ChangePasswordForm />}

				{flags['allow-oauth-logins'] === true && (
					<>
						<Separator className="col-span-full my-4" />

						<Label>Social Logins</Label>
						<div className="col-span-2 flex gap-4">
							<GoogleIcon
								className={cn('size-6', {
									grayscale: auth.user?.googleId === null,
								})}
							/>

							<FacebookIcon
								className={cn('size-6', {
									grayscale: auth.user?.facebookId === null,
								})}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
