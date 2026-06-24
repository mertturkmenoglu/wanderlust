import { type PropsWithChildren, useRef, useState } from 'react';
import {
	useSearchBox as riUseSearchbox,
	type UseSearchBoxProps,
} from 'react-instantsearch';

type Props = {
	isSearchOnType?: boolean;
} & UseSearchBoxProps;

export function useSearchBox(props: Props) {
	const searchbox = riUseSearchbox();
	const [value, setValue] = useState(searchbox.query);
	const ref = useRef<HTMLInputElement>(null);

	const setQuery = (newQuery: string) => {
		setValue(newQuery);

		if (props.isSearchOnType) {
			searchbox.refine(newQuery);
		}
	};

	const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (ref.current) {
			ref.current.blur();
		}

		if (!props.isSearchOnType) {
			searchbox.refine(value);
		}
	};

	const onReset = (e: React.SyntheticEvent<HTMLFormElement, Event>) => {
		e.preventDefault();
		e.stopPropagation();

		setQuery('');

		if (ref.current) {
			ref.current.focus();
		}

		if (!props.isSearchOnType) {
			searchbox.refine('');
		}
	};

	return {
		Form: SearchboxForm,
		onSubmit,
		onReset,
		ref,
		value,
		setQuery,
		...searchbox,
	};
}

type SearchboxFormProps = PropsWithChildren<{
	onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
	onFocus?: () => void;
	onReset: (e: React.SyntheticEvent<HTMLFormElement, Event>) => void;
}>;

export function SearchboxForm({
	onSubmit,
	onFocus,
	onReset,
	children,
}: SearchboxFormProps) {
	return (
		<form
			action=""
			noValidate
			onSubmit={onSubmit}
			onFocus={onFocus}
			onReset={onReset}
		>
			{children}
		</form>
	);
}
