import { z } from 'zod';

export const FormSchema = z.object({
	newPassword: z
		.string()
		.min(8, { message: 'At least 8 characters' })
		.max(128, { message: 'Password is too long' })
		.superRefine((data, ctx) => {
			let flag = false;
			if (data.includes(' ')) {
				ctx.addIssue({
					code: 'custom',
					message: 'Password cannot contain spaces',
				});
				flag = true;
			}

			if (!/[A-Z]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one uppercase letter',
				});
				flag = true;
			}

			if (!/[a-z]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one lowercase letter',
				});
				flag = true;
			}

			if (!/[0-9]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one number',
				});
				flag = true;
			}

			if (!/[^A-Za-z0-9]/.test(data)) {
				ctx.addIssue({
					code: 'custom',
					message: 'At least one special character',
				});
				flag = true;
			}

			if (flag) {
				return z.NEVER;
			}
		}),
});

export type FormInput = z.infer<typeof FormSchema>;
