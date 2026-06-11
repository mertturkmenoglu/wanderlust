import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Logo } from '@/components/logo';
import { useSignInForm, useSignInMutation } from './-hooks';

export const Route = createFileRoute('/sign-in')({
	component: RouteComponent,
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const form = useSignInForm();
	const mutation = useSignInMutation();

	return (
		<form
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					email: data.email,
					password: data.password,
				});
			})}
			className="mx-auto my-32 max-w-lg"
		>
			<FieldGroup className="gap-4">
				<Logo variant="medium" />
				<FieldSet>
					<FieldLegend>Sign in to Wanderlust</FieldLegend>
				</FieldSet>

				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								{...field}
								id="email"
								placeholder="Email"
								autoComplete="email"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="password"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="password">Password</FieldLabel>

							<InputGroup>
								<InputGroupInput
									{...field}
									id="password"
									placeholder="Password"
									aria-invalid={fieldState.invalid}
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? (
											<EyeIcon className="size-4" />
										) : (
											<EyeOffIcon className="size-4" />
										)}
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending && <Spinner />}
					<span>Sign In</span>
				</Button>
			</FieldGroup>
		</form>
	);
}
