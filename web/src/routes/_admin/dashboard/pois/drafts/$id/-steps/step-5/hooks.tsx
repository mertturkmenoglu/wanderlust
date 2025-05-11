import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';

export function useUpload() {
  const service = useMachine(fileUpload.machine, {
    id: useId(),
    accept: ['image/jpeg', 'image/png'],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 10, // 10MB
  });

  return fileUpload.connect(service, normalizeProps);
}
