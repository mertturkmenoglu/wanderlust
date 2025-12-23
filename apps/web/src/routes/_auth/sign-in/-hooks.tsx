import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
	email: z.email().min(1, { message: 'Email is required' }),
	password: z.string().min(1, { message: 'Password is required' }),
});

export function useSignInForm() {
	return useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
}
