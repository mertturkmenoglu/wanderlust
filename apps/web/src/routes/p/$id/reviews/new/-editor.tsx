import { EditorContent, EditorContext } from '@tiptap/react';
import { useMemo } from 'react';
import { lengthTracker } from '@/lib/form';
import { useCreateReviewEditor } from './-hooks';

type Props = {
	value: string;
	onChangeRichTextListener: (value: string) => void;
	onChangePlainTextListener?: (value: string) => void;
	onBlur?: () => void;
};

export function CreateReviewEditor({
	value,
	onChangeRichTextListener,
	onBlur,
	onChangePlainTextListener,
}: Props) {
	const editor = useCreateReviewEditor({
		value,
		onChangeRichTextListener,
		onChangePlainTextListener,
	});

	const memoizedEditor = useMemo(() => ({ editor }), [editor]);

	return (
		<div>
			<EditorContext.Provider value={memoizedEditor}>
				<EditorContent editor={editor} onBlur={onBlur} />
			</EditorContext.Provider>

			<div className="mt-2 text-muted-foreground text-xs">
				{lengthTracker(editor?.getText() ?? '', 2048)}
			</div>
		</div>
	);
}
