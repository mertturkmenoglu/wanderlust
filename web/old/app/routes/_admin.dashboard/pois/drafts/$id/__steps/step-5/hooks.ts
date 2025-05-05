import * as collapsible from "@zag-js/collapsible";
import * as fileUpload from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";

export function useUpload() {
  const [cstate, csend] = useMachine(collapsible.machine({ id: useId() }));
  const collapseApi = collapsible.connect(cstate, csend, normalizeProps);
  const [fstate, fsend] = useMachine(
    fileUpload.machine({
      id: useId(),
      accept: "image/*",
      maxFiles: 10,
      maxFileSize: 1024 * 1024 * 10, // 10MB
    })
  );
  const fileApi = fileUpload.connect(fstate, fsend, normalizeProps);
  return [collapseApi, fileApi] as const;
}
