import { Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import type { TEnrichedTextSegment } from './types';
import { nl2br } from './utils';

type RendererProps = {
	segment: TEnrichedTextSegment;
};

function PlainTextRenderer({ segment }: RendererProps) {
	return <span>{nl2br(segment.text)}</span>;
}

function ExternalUrlRenderer({ segment }: RendererProps) {
	if (!segment.facet) return null;

	return (
		<a
			href={segment.facet.value}
			target="_blank"
			rel="noopener noreferrer"
			className={cn('text-primary underline underline-offset-2')}
		>
			{segment.text}
		</a>
	);
}

function UserMentionRenderer({ segment }: RendererProps) {
	if (!segment.facet) return null;

	const username = segment.facet.value.slice(1); // Remove the '@' from the mention

	return (
		<Link
			to="/u/$username"
			params={{
				username,
			}}
			className={cn('text-primary')}
		>
			{segment.text}
		</Link>
	);
}

function HashtagRenderer({ segment }: RendererProps) {
	if (!segment.facet) return null;

	const hashtag = segment.facet.value.slice(1); // Remove the '#' from the hashtag

	return (
		<Link
			to="/search/$type"
			params={{
				type: 'hashtags',
			}}
			search={{ q: `${hashtag}` }}
			className={cn('text-primary')}
		>
			{segment.text}
		</Link>
	);
}

export function renderSegment(segment: TEnrichedTextSegment) {
	if (!segment.facet) {
		return <PlainTextRenderer segment={segment} />;
	}

	switch (segment.facet.type) {
		case 'url':
			return <ExternalUrlRenderer segment={segment} />;
		case 'mention':
			return <UserMentionRenderer segment={segment} />;
		case 'hashtag':
			return <HashtagRenderer segment={segment} />;
		default:
			return <PlainTextRenderer segment={segment} />;
	}
}
