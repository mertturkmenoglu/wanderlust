import * as linkify from 'linkifyjs';

/**
 * We now only rely on the default linkify instance to only extract URLs.
 *
 * We have our own hashtag and mention extraction logic, so we don't need to use the linkify plugins for those.
 *
 * ~~Creates a custom linkify instance with support for hashtags and mentions.
 * Using plugins directly doesn't work. This function registers the plugins manually to ensure they are applied correctly.
 * If you need to add more plugins in the future, add them to this function and register them.~~
 */
export function createLinkifyInstance() {
	linkify.init();

	return linkify;
}
