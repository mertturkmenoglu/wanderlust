import * as collapsible from '@zag-js/collapsible';
import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';

export function useUpload() {
  const [cstate, csend] = useMachine(collapsible.machine({ id: useId() }));
  const capi = collapsible.connect(cstate, csend, normalizeProps);
  const [fstate, fsend] = useMachine(
    fileUpload.machine({
      id: useId(),
      accept: 'image/*',
      maxFiles: 4,
      maxFileSize: 1024 * 1024 * 2, // 2MB
    })
  );
  const fapi = fileUpload.connect(fstate, fsend, normalizeProps);
  return [capi, fapi] as const;
}
