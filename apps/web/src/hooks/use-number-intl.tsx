import { useNumberFormatter } from '@/hooks/use-number-formatter';

type UseNumberIntlOptions = {
	one: string;
	other: string;
};

export function useNumberIntl(opts: UseNumberIntlOptions) {
	const numFmt = useNumberFormatter();
	const pluralRules = new Intl.PluralRules('en-US');

	return (count: number) => {
		const formattedLikes = numFmt.format(count);
		const pluralCategory = pluralRules.select(count);

		if (pluralCategory === 'one') {
			return `${formattedLikes} ${opts.one}`;
		}

		return `${formattedLikes} ${opts.other}`;
	};
}
