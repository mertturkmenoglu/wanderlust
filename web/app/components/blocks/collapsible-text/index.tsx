import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  text: string;
  charLimit?: number;
  className?: string;
};

export default function CollapsibleText({
  text,
  className,
  charLimit = 200,
}: Props) {
  const [showMore, setShowMore] = useState(false);
  const [showButton] = useState(() => text.length > charLimit);
  const shortText =
    text.length < charLimit ? text : text.slice(0, charLimit) + "...";

  return (
    <div className={cn(className)}>
      <p className="mt-2 text-sm text-gray-500">
        {showMore ? text : shortText}
      </p>

      {showButton && (
        <Button
          variant="link"
          className="px-0"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
