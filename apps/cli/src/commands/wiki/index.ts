import { command } from '@drizzle-team/brocli';
import { wikiCity } from './city';
import { wikiVoyage } from './voyage';

export const wiki = command({
	name: 'wiki',
	desc: 'Wikipedia related data extraction commands',
	aliases: ['w'],
	subcommands: [wikiCity, wikiVoyage],
});
