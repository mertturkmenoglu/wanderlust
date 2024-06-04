import { normalizeProps, useMachine } from '@zag-js/react';
import * as tagsInput from '@zag-js/tags-input';

export function useTags() {
  const [state, send] = useMachine(
    tagsInput.machine({
      id: 'tags-input',
      value: [],
      max: 5,
      maxLength: 15,
    })
  );
  return tagsInput.connect(state, send, normalizeProps);
}
