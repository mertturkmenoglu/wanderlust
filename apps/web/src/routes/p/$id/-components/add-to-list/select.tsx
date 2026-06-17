import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useAddToListContext } from './context';
import { useCheckStatusQuery } from './hooks';

export function ListSelect() {
	const ctx = useAddToListContext();
	const query = useCheckStatusQuery();
	const statuses = query.data.statuses;

	return (
		<SuspenseWrapper>
			<Select onValueChange={(v) => ctx.setListId(v)}>
				<SelectTrigger className="mt-4 w-full">
					<SelectValue placeholder="Select a list" />
				</SelectTrigger>
				<SelectContent className="max-h-96 w-full">
					{statuses.map((status) => (
						<SelectItem
							value={status.id}
							key={status.id}
							disabled={status.includes}
							className="wrap-break-word"
						>
							{status.name}
							{status.includes ? ' (Already added)' : ''}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</SuspenseWrapper>
	);
}
