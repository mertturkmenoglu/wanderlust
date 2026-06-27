import { useParams, useSearch } from '@tanstack/react-router';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';

type State = {
	tripId: string;
	isOpen: boolean;
	dialog: boolean;
	update: boolean;
	placeId?: string;
	description: string;
	setDescription: Dispatch<SetStateAction<string>>;
	scheduledTime: Date;
	setScheduledTime: Dispatch<SetStateAction<Date>>;
	locId?: string;
	onOpen?: () => void;
};

export const UpsertLocationDialogContext = createContext<State | null>(null);

type Props = PropsWithChildren<{
	onOpen?: () => void;
}>;

export function UpsertLocationDialogContextProvider({
	children,
	onOpen,
}: Props) {
	const params = useParams({ from: '/trips/$id/details/' });
	const search = useSearch({ from: '/trips/$id/details/' });

	const [description, setDescription] = useState('');
	const [scheduledTime, setScheduledTime] = useState(new Date());

	useEffect(() => {
		if (search.description) {
			setDescription(search.description);
		}

		if (search.time) {
			setScheduledTime(new Date(search.time));
		}
	}, [search.description, search.time]);

	return (
		<UpsertLocationDialogContext.Provider
			value={{
				tripId: params.id,
				isOpen: search.dialog === true,
				dialog: search.dialog === true,
				update: search.update === true,
				placeId: search.placeId,
				description,
				setDescription,
				scheduledTime,
				setScheduledTime,
				locId: search.locId,
				onOpen,
			}}
		>
			{children}
		</UpsertLocationDialogContext.Provider>
	);
}

export function useUpsertLocationDialogContext() {
	const context = useContext(UpsertLocationDialogContext);

	if (!context) {
		throw new Error(
			'useUpsertLocationDialogContext must be used within a UpsertLocationDialogContextProvider',
		);
	}

	return context;
}
