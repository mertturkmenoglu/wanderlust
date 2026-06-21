import { Input } from '@wanderlust/ui/components/input';
import { Activity } from 'react';
import { useNewChatDialogContext } from './context';
import { Results } from './results';
import { SendMessageView } from './send-message';

export function Content() {
	const ctx = useNewChatDialogContext();

	return (
		<>
			<Activity mode={ctx.view === 'search' ? 'visible' : 'hidden'}>
				<Input
					value={ctx.searchTerm}
					onChange={(e) => ctx.setSearchTerm(e.target.value)}
					placeholder="Search by username"
					type="search"
				/>

				<Results />
			</Activity>

			<Activity mode={ctx.view === 'send' ? 'visible' : 'hidden'}>
				<SendMessageView />
			</Activity>
		</>
	);
}
