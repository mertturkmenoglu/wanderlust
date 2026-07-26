import { Content } from './content';
import { UpsertLocationDialogContextProvider } from './context';

type Props = {
	onOpen?: () => void;
};

export function UpsertLocationDialog({ onOpen }: Props) {
	return (
		<UpsertLocationDialogContextProvider onOpen={onOpen}>
			<Content />
		</UpsertLocationDialogContextProvider>
	);
}
