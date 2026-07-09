import { Mention } from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { orpc } from '@/lib/orpc';
import { MentionList, type MentionListRef } from './mention-list';

/**
 * Scoped version of the StarterKit extension that disables most of the features,
 * leaving only:
 * - **document**
 * - **paragraph**
 * - **text**
 *
 * nodes enabled. This is useful for creating a minimal editor.
 * @returns StarterKit instance with most features disabled.
 */
export function getScoppedStarterKit() {
	return StarterKit.configure({
		link: false,
		blockquote: false,
		bold: false,
		italic: false,
		code: false,
		heading: false,
		bulletList: false,
		codeBlock: false,
		dropcursor: false,
		gapcursor: false,
		hardBreak: false,
		horizontalRule: false,
		listItem: false,
		listKeymap: false,
		orderedList: false,
		strike: false,
		trailingNode: false,
		underline: false,
		undoRedo: false,
	});
}

/**
 * Scoped version of the Mention extension that is tailored for user mentions.
 */
export function getUserMentionExtension() {
	return Mention.configure({
		HTMLAttributes: {
			class: 'mention',
		},
		suggestions: [
			{
				char: '@',
				minQueryLength: 2,
				debounce: 300,
				initialItems: [],
				items: async ({ query, signal }) => {
					const res = await orpc.users.searchFollowing.call(
						{ username: query },
						{ signal },
					);

					return res.friends.slice(0, 8);
				},

				render: () => {
					let component: ReactRenderer<MentionListRef> | undefined;
					let unmount: () => void;

					return {
						onStart(props) {
							component = new ReactRenderer(MentionList, {
								props,
								editor: props.editor,
							});
							// Let the plugin mount and position the popup for you.
							unmount = props.mount(component.element);
						},
						onUpdate(props) {
							// `props.loading` is true while fetching, false otherwise
							// `props.items` contains the resolved data (or initialItems before resolution)
							component?.updateProps(props);
						},
						onKeyDown(props) {
							if (props.event.key === 'Escape') {
								component?.destroy();

								return true;
							}

							return component?.ref?.onKeyDown(props) ?? false;
						},
						onExit() {
							unmount?.();
							component?.destroy();
						},
					};
				},
			},
		],
	});
}
