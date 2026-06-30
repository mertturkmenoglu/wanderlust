import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
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
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { authClient } from '@/lib/auth';

export const Route = createFileRoute('/sign-in/')({
	component: RouteComponent,
});

const schema = z.object({
	email: z.string(),
	password: z.string(),
});

function useSignInMutation() {
	const navigate = useNavigate();

	return useMutation({
		mutationKey: ['sign-in'],
		mutationFn: async (data: { email: string; password: string }) => {
			return await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
				},
				{
					throw: true,
				},
			);
		},
		onSuccess: async () => {
			await navigate({ to: '/' });
			window.location.reload();
		},
		retry: false,
	});
}

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		resolver: zodResolver(schema),
	});

	const mutation = useSignInMutation();

	const onSubmit = form.handleSubmit((data) => {
		mutation.mutate(data);
	});

	return (
		<div className="mx-auto my-32 w-full max-w-xl">
			<form onSubmit={onSubmit}>
				<FieldGroup>
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
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
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
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Button type="submit" disabled={mutation.isPending}>
						{mutation.isPending && <Spinner />}
						<span>Sign In</span>
					</Button>
				</FieldGroup>
			</form>
		</div>
	);
}
