import { useNumberFormatter } from './use-number-formatter';

type UseNumberIntlOptions = {
	one: string;
	other: string;
};

const pluralRules = new Intl.PluralRules('en-US');

export function useNumberIntl(opts: UseNumberIntlOptions) {
	const numFmt = useNumberFormatter();

	return (count: number) => {
		const formattedNumber = numFmt.format(count);
		const pluralCategory = pluralRules.select(count);

		if (pluralCategory === 'one') {
			return `${formattedNumber} ${opts.one}`;
		}

		return `${formattedNumber} ${opts.other}`;
	};
}
