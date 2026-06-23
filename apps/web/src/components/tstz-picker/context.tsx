import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';
import type { TSTZPickerProps } from './types';
import { defaultFormatStr } from './utils';

type State = {
	sHours12: string;
	sSetHours12: Dispatch<SetStateAction<string>>;
	sMinutes: string;
	sSetMinutes: Dispatch<SetStateAction<string>>;
	isAm: boolean;
	setIsAm: Dispatch<SetStateAction<boolean>>;
	tzOffset: string;
	setTzOffset: Dispatch<SetStateAction<string>>;
	hours24: number;
	minutes: number;
	formatted: string;
} & TSTZPickerProps;

export const TSTZPickerContext = createContext<State | null>(null);

type TSTZPickerContextProviderProps = PropsWithChildren<TSTZPickerProps>;

export function TSTZPickerContextProvider(
	props: TSTZPickerContextProviderProps,
) {
	const [sHours12, sSetHours12] = useState<string>(() => {
		const hours = new Date().getHours() % 12 || 12;
		return hours.toString().padStart(2, '0');
	});
	const [sMinutes, sSetMinutes] = useState<string>(() => {
		const minutes = new Date().getMinutes();
		return minutes.toString().padStart(2, '0');
	});
	const [isAm, setIsAm] = useState<boolean>(() => {
		const hours = new Date().getHours();
		return hours < 12;
	});
	const [tzOffset, setTzOffset] = useState<string>(
		format(new Date(), "'UTC'xxx"),
	);

	const hours24 = useMemo(() => {
		return isAm
			? Number.parseInt(sHours12, 10) % 12
			: (Number.parseInt(sHours12, 10) % 12) + 12;
	}, [sHours12, isAm]);

	const minutes = useMemo(() => Number.parseInt(sMinutes, 10), [sMinutes]);

	const formatted = props.value
		? format(props.value, props.formatStr ?? defaultFormatStr, {
				in: tz(tzOffset),
			})
		: 'Pick a date';

	return (
		<TSTZPickerContext.Provider
			value={{
				sHours12,
				sSetHours12,
				sMinutes,
				sSetMinutes,
				isAm,
				setIsAm,
				hours24,
				minutes,
				formatted,
				tzOffset,
				setTzOffset,
				...props,
			}}
		>
			{props.children}
		</TSTZPickerContext.Provider>
	);
}

export function useTSTZPickerContext() {
	const context = useContext(TSTZPickerContext);

	if (!context) {
		throw new Error(
			'useTSTZPickerContext must be used within a TSTZPickerContextProvider',
		);
	}

	return context;
}
