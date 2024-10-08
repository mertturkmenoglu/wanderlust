"use client";

import * as rating from "@zag-js/rating-group";
import { normalizeProps, useMachine } from "@zag-js/react";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

type Props = {
  defaultValue?: number;
  onChange: ({ value }: { value: number }) => void;
  id: string;
  disabled?: boolean;
  starsClassName?: string;
};

export function Rating({
  defaultValue,
  onChange,
  id,
  disabled,
  starsClassName,
}: Props) {
  const [state, send] = useMachine(
    rating.machine({
      id,
      allowHalf: false,
      value: defaultValue,
      disabled,
      onValueChange: onChange,
    })
  );

  const api = rating.connect(state, send, normalizeProps);

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()} className="flex">
        {api.items.map((index) => {
          const state = api.getItemState({ index });
          return (
            <span key={index} {...api.getItemProps({ index })}>
              <Star
                className={cn(
                  "text-primary size-4",
                  {
                    "fill-primary": state.highlighted,
                  },
                  starsClassName
                )}
              />
            </span>
          );
        })}
      </div>
      <input {...api.getHiddenInputProps()} data-testid="hidden-input" />
    </div>
  );
}
