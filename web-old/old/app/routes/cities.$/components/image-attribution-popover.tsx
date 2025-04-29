import { CircleHelpIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ImageAttributes, { Props as IAProps } from "./image-attribution";

type Props = IAProps;

export default function ImageAttributionPopover(props: Props) {
  return (
    <Popover>
      <PopoverTrigger className="relative left-4 bottom-10">
        <>
          <CircleHelpIcon className="size-6 bg-transparent text-primary fill-white rounded-full" />
          <span className="sr-only">See license info</span>
        </>
      </PopoverTrigger>
      <PopoverContent align="start">
        <ImageAttributes {...props} />
      </PopoverContent>
    </Popover>
  );
}
