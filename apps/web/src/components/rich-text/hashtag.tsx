import { Mark, markInputRule } from '@tiptap/react';

export const Hashtag = Mark.create({
	name: 'hashtag',
	inclusive: false,

	parseHTML() {
		return [{ tag: 'span[data-hashtag]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'span',
			{ 'data-hashtag': '', class: 'hashtag', ...HTMLAttributes },
			0,
		];
	},

	addInputRules() {
		return [
			markInputRule({
				find: /(#[a-zA-Z]\w*)\s$/,
				type: this.type,
			}),
		];
	},
});
