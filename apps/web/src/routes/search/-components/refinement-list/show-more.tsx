import { Button } from '@wanderlust/ui/components/button';
import { useRefinementListContext } from './context';

export function ShowMore() {
	const ctx = useRefinementListContext();

	if (!ctx.renderMoreButton) {
		return null;
	}

	return (
		<Button
			variant="link"
			onClick={ctx.rl.toggleShowMore}
			disabled={!ctx.rl.canToggleShowMore}
			className="px-0"
		>
			{ctx.rl.isShowingMore ? 'Show Less' : 'Show More'}
		</Button>
	);
}
