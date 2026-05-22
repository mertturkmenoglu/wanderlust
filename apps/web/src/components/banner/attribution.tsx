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
	text: string;
	link: string;
};

export function Attribution({ text, link }: AttributionProps) {
	return (
		<HoverCard openDelay={300}>
			<HoverCardTrigger className="absolute top-2 right-2">
				<Badge variant="midnight">
					<CircleQuestionMark className="text-midnight-foreground" />{' '}
					Attribution
				</Badge>
			</HoverCardTrigger>
			<HoverCardContent
				align="end"
				className="p-2 text-muted-foreground text-sm shadow-none"
			>
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1"
				>
					<CopyrightIcon className="size-3" />
					<span>{text}</span>
					<ChevronRightIcon className="size-4" />
				</a>
			</HoverCardContent>
		</HoverCard>
	);
}
