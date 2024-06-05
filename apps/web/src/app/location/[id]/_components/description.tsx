'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  description: string;
};

export default function Description({ description }: Props) {
  const charLimit = 200;
  const [showMore, setShowMore] = useState(false);
  const [showButton] = useState(() => description.length > charLimit);
  const shortText =
    description.length < charLimit
      ? description
      : description.slice(0, charLimit) + '...';

  return (
    <div>
      <p className="mt-2 text-sm text-gray-500">
        {showMore ? description : shortText}
      </p>

      {showButton && (
        <Button
          variant="link"
          className="px-0"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  );
}
