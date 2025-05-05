import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertTable,
  ListsToggle,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  tablePlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

import { MDXEditor } from "./editor.client";

type Props = {
  value: string | undefined;
  setValue: (md: string) => void;
};

export default function CustomEditor({ value, setValue }: Props) {
  return (
    <MDXEditor
      className="prose w-full col-span-full"
      markdown={value ?? ""}
      onChange={(md) => setValue(md)}
      plugins={[
        headingsPlugin(),
        diffSourcePlugin({
          viewMode: "source",
        }),
        listsPlugin(),
        linkPlugin(),
        tablePlugin(),
        linkDialogPlugin(),
        toolbarPlugin({
          toolbarClassName: "my-classname",
          toolbarContents: () => (
            <>
              {" "}
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
