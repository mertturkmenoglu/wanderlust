import { run } from '@drizzle-team/brocli';
import { clean } from './commands/clean';
import { echo } from './commands/echo';
import { fake } from './commands/fake';
import { mapStyles } from './commands/map-styles';
import { sync } from './commands/sync';

run([echo, clean, fake, sync, mapStyles], {
	version: '1.0.0',
});
