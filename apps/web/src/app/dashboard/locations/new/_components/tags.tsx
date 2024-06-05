import { PropTypes } from '@zag-js/react';
import * as tagsInput from '@zag-js/tags-input';

type Props = {
  api: tagsInput.Api<PropTypes>;
};

export default function Tags({ api }: Props) {
  return (
    <div
      {...api.rootProps}
      className="flex gap-2 rounded border border-border p-1"
    >
      {api.value.map((value, index) => (
        <span
          key={index}
          {...api.getItemProps({ index, value })}
        >
          <div
            {...api.getItemPreviewProps({ index, value })}
            className="rounded border border-primary bg-primary/10 px-2 py-0.5 text-primary"
          >
            <span>{value} </span>
            <button {...api.getItemDeleteTriggerProps({ index, value })}>
              &#x2715;
            </button>
          </div>
          <input {...api.getItemInputProps({ index, value })} />
        </span>
      ))}
      <input
        placeholder="Add tag..."
        className="px-2 outline-none"
        {...api.inputProps}
      />
    </div>
  );
}
