import type { Outputs } from '@/lib/orpc';

export type TComment = Outputs['trips']['listComments']['comments'][number];

export type CommentProps = {
	comment: TComment;
};
