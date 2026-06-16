import { Input } from '@wanderlust/ui/components/input';
import { useRefinementListContext } from './context';

export function RLInput() {
	const ctx = useRefinementListContext();

	if (!ctx.showInput) {
		return null;
	}

	return (
		<Input
			type="search"
			autoComplete="off"
			autoCorrect="off"
			autoCapitalize="off"
			spellCheck={false}
			maxLength={512}
			className="mt-2"
			onChange={(event) => ctx.rl.searchForItems(event.currentTarget.value)}
			placeholder={ctx.searchPlaceholder}
		/>
	);
}
