import { Badge } from '@wanderlust/ui/components/badge';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@wanderlust/ui/components/hover-card';
import {
	ChevronRightIcon,
	CircleQuestionMark,
	CopyrightIcon,
} from 'lucide-react';
import type { AttributionProps } from './types';

export function Attribution({ attributions, delay = 300 }: AttributionProps) {
	return (
		<HoverCard>
			<HoverCardTrigger
				delay={delay}
				className="absolute top-2 right-2"
				data-testid="attribution-hover-trigger"
			>
				<Badge variant="midnight">
					<CircleQuestionMark className="text-midnight-foreground" />{' '}
					Attribution
				</Badge>
			</HoverCardTrigger>
			<HoverCardContent
				align="end"
				data-testid="attribution-hover-card"
				className="p-2 text-muted-foreground text-sm shadow-none"
			>
				{attributions.map((attr) => (
					<a
						key={`${attr.text}-${attr.link}`}
						href={attr.link}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1"
					>
						<CopyrightIcon className="size-3" />
						<span>{attr.text}</span>
						<ChevronRightIcon className="size-4" />
					</a>
				))}
			</HoverCardContent>
		</HoverCard>
	);
}
