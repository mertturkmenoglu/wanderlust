import * as linkify from 'linkifyjs';

/**
 * Creates a custom linkify instance with support for hashtags and mentions.
 * Using plugins directly doesn't work. This function registers the plugins manually to ensure they are applied correctly.
 * If you need to add more plugins in the future, add them to this function and register them.
 */
export function createLinkifyInstance() {
	const HashtagToken = linkify.createTokenClass('hashtag', {
		isLink: true,
	});

	// biome-ignore lint/suspicious/noExplicitAny: linkify type gives error, I don't know why.
	function hashtag({ scanner, parser }: any) {
		const {
			POUND,
			UNDERSCORE,
			FULLWIDTHMIDDLEDOT,
			ASCIINUMERICAL,
			ALPHANUMERICAL,
		} = scanner.tokens;
		const { alpha, numeric, alphanumeric, emoji } = scanner.tokens.groups;

		const Hash = parser.start.tt(POUND);
		const HashPrefix = Hash.tt(UNDERSCORE);
		const Hashtag = new linkify.State(HashtagToken);
		Hash.tt(ASCIINUMERICAL, Hashtag);
		Hash.tt(ALPHANUMERICAL, Hashtag);
		Hash.ta(numeric, HashPrefix);
		Hash.ta(alpha, Hashtag);
		Hash.ta(emoji, Hashtag);
		Hash.ta(FULLWIDTHMIDDLEDOT, Hashtag);
		HashPrefix.tt(ASCIINUMERICAL, Hashtag);
		HashPrefix.tt(ALPHANUMERICAL, Hashtag);
		HashPrefix.ta(alpha, Hashtag);
		HashPrefix.ta(emoji, Hashtag);
		HashPrefix.ta(FULLWIDTHMIDDLEDOT, Hashtag);
		HashPrefix.ta(numeric, HashPrefix);
		HashPrefix.tt(UNDERSCORE, HashPrefix);
		Hashtag.ta(alphanumeric, Hashtag);
		Hashtag.ta(emoji, Hashtag);
		Hashtag.tt(FULLWIDTHMIDDLEDOT, Hashtag);
		Hashtag.tt(UNDERSCORE, Hashtag);
	}

	linkify.registerPlugin('hashtag', hashtag);

	const MentionToken = linkify.createTokenClass('mention', {
		isLink: true,
		toHref() {
			return `/${this.toString().slice(1)}`;
		},
	});

	// biome-ignore lint/suspicious/noExplicitAny: linkify type gives error, I don't know why.
	function mention({ scanner, parser }: any) {
		const { HYPHEN, SLASH, UNDERSCORE, AT } = scanner.tokens;
		const { domain } = scanner.tokens.groups;

		const At = parser.start.tt(AT);

		const AtHyphen = At.tt(HYPHEN);
		AtHyphen.tt(HYPHEN, AtHyphen);

		const Mention = At.tt(UNDERSCORE, MentionToken);
		At.ta(domain, Mention);
		AtHyphen.tt(UNDERSCORE, Mention);
		AtHyphen.ta(domain, Mention);

		Mention.ta(domain, Mention);
		Mention.tt(HYPHEN, Mention);
		Mention.tt(UNDERSCORE, Mention);

		const MentionDivider = Mention.tt(SLASH);

		MentionDivider.ta(domain, Mention);
		MentionDivider.tt(UNDERSCORE, Mention);
		MentionDivider.tt(HYPHEN, Mention);
	}

	linkify.registerPlugin('mention', mention);

	linkify.init();

	return linkify;
}
