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

export type AttributionProps = {
	attributions: {
		text: string;
		link: string;
	}[];
};

export function Attribution({ attributions }: AttributionProps) {
	return (
		<HoverCard>
			<HoverCardTrigger delay={300} className="absolute top-2 right-2">
				<Badge variant="midnight">
					<CircleQuestionMark className="text-midnight-foreground" />{' '}
					Attribution
				</Badge>
			</HoverCardTrigger>
			<HoverCardContent
				align="end"
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
