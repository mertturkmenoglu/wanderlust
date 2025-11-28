import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CreateLink,
	DiffSourceToggleWrapper,
	diffSourcePlugin,
	headingsPlugin,
	InsertTable,
	ListsToggle,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	MDXEditor,
	tablePlugin,
	toolbarPlugin,
	UndoRedo,
} from '@mdxeditor/editor';

type Props = {
	value: string | undefined;
	setValue: (md: string) => void;
};

export function CustomEditor({ value, setValue }: Props) {
	return (
		<MDXEditor
			className="prose col-span-full w-full"
			markdown={value ?? ''}
			onChange={(md) => setValue(md)}
			plugins={[
				headingsPlugin(),
				diffSourcePlugin({
					viewMode: 'source',
				}),
				listsPlugin(),
				linkPlugin(),
				tablePlugin(),
				linkDialogPlugin(),
				toolbarPlugin({
					toolbarClassName: 'my-classname',
					toolbarContents: () => (
						<>
							{' '}
							<BoldItalicUnderlineToggles />
							<BlockTypeSelect />
							<CreateLink />
							<InsertTable />
							<ListsToggle />
							<DiffSourceToggleWrapper>
								<UndoRedo />
							</DiffSourceToggleWrapper>
						</>
					),
				}),
			]}
		/>
	);
}
