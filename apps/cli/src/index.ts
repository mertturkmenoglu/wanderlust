import { run } from '@drizzle-team/brocli';
import { adr } from './commands/adr';
import { clean } from './commands/clean';
import { doctor } from './commands/doctor';
import { echo } from './commands/echo';
import { fake } from './commands/fake';
import { gnci } from './commands/gnci';
import { mapStyles } from './commands/map-styles';
import { scaffold } from './commands/scaffold';
import { sync } from './commands/sync';
import { wiki } from './commands/wiki';

run([adr, clean, doctor, echo, fake, gnci, mapStyles, scaffold, sync, wiki], {
	version: '1.0.0',
});
