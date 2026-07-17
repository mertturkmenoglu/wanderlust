import type { Outputs } from '@/lib/orpc';

export type TComment = Outputs['trips']['comments']['list']['comments'][number];

export type CommentProps = {
	comment: TComment;
};
