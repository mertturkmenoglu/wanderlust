import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { useState } from 'react';
import { useParagraphs } from './hooks';

type Props = {
	text: string;
	charLimit?: number;
	className?: string;
};

export function CollapsibleText({ text, className, charLimit = 200 }: Props) {
	const [showMore, setShowMore] = useState(false);
	const [showButton] = useState(() => text.length > charLimit);
	const paragraphs = useParagraphs(text, charLimit, showMore);

	return (
		<div className={cn(className)}>
			<div className="flex flex-col text-gray-500 text-sm">
				{paragraphs.map((p) => (
					<div key={`paragraph-${p}`} className="mt-4 first:mt-0">
						{p}
					</div>
				))}
			</div>

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
