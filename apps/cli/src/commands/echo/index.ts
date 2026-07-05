import { command, positional } from '@drizzle-team/brocli';

export const echo = command({
	name: 'echo',
	options: {
		text: positional().desc('Text to echo').default('echo'),
	},
	handler: (opts) => {
		console.log(opts.text);
	},
});
