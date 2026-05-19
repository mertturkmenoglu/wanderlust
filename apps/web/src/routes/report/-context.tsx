import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';

type State = {
	submitted: boolean;
	setSubmitted: Dispatch<SetStateAction<boolean>>;
};

export const ReportContext = createContext<State | null>(null);

export function ReportContextProvider({ children }: PropsWithChildren) {
	const [submitted, setSubmitted] = useState(false);

	return (
		<ReportContext.Provider value={{ submitted, setSubmitted }}>
			{children}
		</ReportContext.Provider>
	);
}

export function useReportContext() {
	const context = useContext(ReportContext);

	if (!context) {
		throw new Error(
			'useReportContext must be used within a ReportContextProvider',
		);
	}

	return context;
}
