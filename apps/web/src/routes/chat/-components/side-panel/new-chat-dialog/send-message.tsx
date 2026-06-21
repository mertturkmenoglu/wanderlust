import { Button } from '@wanderlust/ui/components/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { ArrowLeftIcon, SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';
import { useNewChatDialogContext } from './context';
import { ResultItem } from './result-item';

export function SendMessageView() {
	const [text, setText] = useState('');
	const ctx = useNewChatDialogContext();
	const isDisabled = text.trim() === '';

	const handleSend = () => {
		alert('Message sent: ' + text);
	};

	if (!ctx.selectedUser) {
		return null;
	}

	return (
		<div>
			<Button
				variant="link"
				className="px-0!"
				onClick={() => ctx.setSelectedUser(null)}
			>
				<ArrowLeftIcon />
				Select another user
			</Button>

			<ResultItem user={ctx.selectedUser} isSelected />

			<InputGroup className="mt-4">
				<InputGroupInput
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={`Say hi to ${ctx.selectedUser.name}`}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey && text.trim() !== '') {
							e.preventDefault();
							handleSend();
						}
					}}
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton
						onClick={handleSend}
						disabled={isDisabled}
						variant="midnight"
					>
						Send
						<SendHorizonalIcon />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}
