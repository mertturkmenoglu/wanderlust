import * as collapsible from "@zag-js/collapsible";
import * as fileUpload from "@zag-js/file-upload";
import { PropTypes } from "@zag-js/react";
import { Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import Preview from "./preview";

type Props = {
  capi: collapsible.Api;
  fapi: fileUpload.Api<PropTypes>;
};

export default function Dnd({ capi, fapi }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div
        {...capi.getRootProps()}
        className="flex w-full flex-col items-center text-center"
      >
        <Button {...capi.getTriggerProps()} variant="ghost" size="icon">
          <Upload className="size-4" />
        </Button>
        <div {...capi.getContentProps()} className="w-full">
          <div
            {...fapi.getRootProps()}
            className="w-full rounded border border-dashed border-muted-foreground p-4"
          >
            <div {...fapi.getDropzoneProps()}>
              <input {...fapi.getHiddenInputProps()} />
              <span>Drag your file(s) here</span>
              <span className="text-muted-foreground"> or</span>
            </div>

            <Button
              {...fapi.getTriggerProps()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Choose file(s)
            </Button>

            <ul
              {...fapi.getItemGroupProps()}
              className="mt-4 grid grid-cols-3 place-content-center gap-4"
            >
              {fapi.acceptedFiles.map((file) => (
                <li
                  key={file.name}
                  {...fapi.getItemProps({ file })}
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Preview file={file} />

                  <Button
                    {...fapi.getItemDeleteTriggerProps({
                      file,
                    })}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
