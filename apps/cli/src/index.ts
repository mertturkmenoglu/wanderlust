import { run } from '@drizzle-team/brocli';
import { adr } from './commands/adr';
import { clean } from './commands/clean';
import { doctor } from './commands/doctor';
import { echo } from './commands/echo';
import { fake } from './commands/fake';
import { mapStyles } from './commands/map-styles';
import { scaffold } from './commands/scaffold';
import { sync } from './commands/sync';

run([adr, clean, doctor, echo, fake, mapStyles, scaffold, sync], {
	version: '1.0.0',
});
