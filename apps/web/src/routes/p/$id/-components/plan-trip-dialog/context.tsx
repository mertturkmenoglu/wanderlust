import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';
import type { PlanTripDialogView } from './types';

type State = {
	view: PlanTripDialogView;
	setView: Dispatch<SetStateAction<PlanTripDialogView>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export const PlanTripDialogContext = createContext<State | null>(null);

export function PlanTripDialogContextProvider({ children }: PropsWithChildren) {
	const [view, setView] = useState<PlanTripDialogView>('choose');
	const [open, setOpen] = useState<boolean>(false);

	const state = useMemo(() => {
		const state: State = {
			view,
			setView,
			open,
			setOpen,
		};

		return state;
	}, [view, open]);

	return (
		<PlanTripDialogContext.Provider value={state}>
			{children}
		</PlanTripDialogContext.Provider>
	);
}

export function usePlanTripDialogContext() {
	const context = useContext(PlanTripDialogContext);

	if (!context) {
		throw new Error(
			'usePlanTripDialogContext must be used within a PlanTripDialogContextProvider',
		);
	}

	return context;
}
