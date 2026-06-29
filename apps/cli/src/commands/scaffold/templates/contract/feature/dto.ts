export const template = `
import z from 'zod';

export const getInput = z.object({
	id: z.string(),
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
	{{featureSingle}}: z.object({}),
});

export type GetOutput = z.infer<typeof getOutput>;
`;
