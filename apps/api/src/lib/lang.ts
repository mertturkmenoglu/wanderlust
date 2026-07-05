import { type Options as FrancOptions, franc } from 'franc';

/**
 * LangCodeFormats is an object that defines the supported language code formats for the detectLanguage function. It includes two properties:
 * - TwoLetter: Represents the ISO 639-1 two-letter code format for languages.
 * - ThreeLetter: Represents the ISO 639-3 three-letter code format for languages, which is an extended version of ISO 639-2.
 *
 * These formats are used to specify the desired output format when detecting the language of a given text.
 */
export const LangCodeFormats = {
	/**
	 * TwoLetter: Represents the ISO 639-1 two-letter code format for languages.
	 */
	TwoLetter: 'ISO 639-1',
	/**
	 * ThreeLetter: Represents the ISO 639-3 three-letter code format for languages, which is an extended version of ISO 639-2.
	 */
	ThreeLetter: 'ISO 639-3',
} as const;

type LangCodeFormat = (typeof LangCodeFormats)[keyof typeof LangCodeFormats];

type DetectLanguageOptions = {
	francOptions?: FrancOptions;
	outputFormat: LangCodeFormat;
};

/**
 * Detect the language of a given text using the franc library and return the language code in the specified format (ISO 639-1 or ISO 639-3).
 *
 * @param text The text to detect the language of.
 * @param opts The options for language detection, including the desired output format and franc options.
 * @returns The detected language code in the specified format, or null if undetermined.
 */
export function detectLanguage(
	text: string,
	opts: DetectLanguageOptions,
): string | null {
	// Franc returns ISO 639-3 codes or "und" for undetermined.
	const francOutput = franc(text, opts.francOptions);

	// If the output is "und", return null
	if (francOutput === 'und') {
		return null;
	}

	// If the output format is ISO 639-1 (two letter codes), convert the ISO 639-3 code to ISO 639-1
	// Intl can be used here.
	// Construct the Intl locale with "en-US" and give the language code as the options.
	// Then retrieve the language code from the locale object.
	// Either:
	// (A) It will return the ISO 639-1 code.
	// (B) Or if the language code is not supported in ISO 639-1, it will return the ISO 639-3 code.
	if (opts.outputFormat === LangCodeFormats.TwoLetter) {
		const locale = new Intl.Locale('en-US', { language: francOutput });
		return locale.language;
	}

	// If the desired output format is ISO 639-3 (three letter codes), return the franc output directly.
	return francOutput;
}
