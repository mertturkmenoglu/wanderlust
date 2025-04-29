import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useParagraphs } from "./hooks";

type Props = {
  text: string;
  charLimit?: number;
  className?: string;
};

export default function CollapsibleText({ text, className, charLimit = 200 }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [showButton] = useState(() => text.length > charLimit);
  const paragraphs = useParagraphs(text, charLimit, showMore);

  return (
    <div className={cn(className)}>
      <div className="mt-2 text-sm text-gray-500 flex flex-col">
        {paragraphs.map((p, i) => (
          <div key={i} className="mt-4 first:mt-0">
            {p}
          </div>
        ))}
      </div>

      {showButton && (
        <Button variant="link" className="px-0" onClick={() => setShowMore((prev) => !prev)}>
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
