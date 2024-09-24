import { useState } from "react";
import { Button } from "~/components/ui/button";

type Props = {
  text: string;
  charLimit?: number;
};

export default function CollapsibleText({ text, charLimit = 200 }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [showButton] = useState(() => text.length > charLimit);
  const shortText =
    text.length < charLimit ? text : text.slice(0, charLimit) + "...";

  return (
    <div>
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
