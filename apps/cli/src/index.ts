import { run } from '@drizzle-team/brocli';
import { clean } from './commands/clean';
import { echo } from './commands/echo';
import { fake } from './commands/fake';
import { sync } from './commands/sync';

run([echo, clean, fake, sync], {
	version: '1.0.0',
});
