import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { SearchIcon, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { type UseSearchBoxProps, useSearchBox } from 'react-instantsearch';

type Props = {
	isSearchOnType?: boolean;
} & UseSearchBoxProps;

export function CustomSearchBox({ isSearchOnType = false, ...props }: Props) {
	const { query, refine } = useSearchBox(props);
	const [inputValue, setInputValue] = useState(query);
	const inputRef = useRef<HTMLInputElement>(null);

	function setQuery(newQuery: string) {
		setInputValue(newQuery);
		if (isSearchOnType) {
			refine(newQuery);
		}
	}

	return (
		<div>
			{/** biome-ignore lint/a11y/useSemanticElements: TODO */}
			<form
				action=""
				role="search"
				className="flex gap-2"
				noValidate
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();

					if (inputRef.current) {
						inputRef.current.blur();
					}

					if (!isSearchOnType) {
						refine(inputValue);
					}
				}}
				onReset={(e) => {
					e.preventDefault();
					e.stopPropagation();

					setQuery('');

					if (inputRef.current) {
						inputRef.current.focus();
					}

					if (!isSearchOnType) {
						refine('');
					}
				}}
			>
				<InputGroup>
					<InputGroupInput
						ref={inputRef}
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						className="rounded-md"
						placeholder="Search a place"
						spellCheck={false}
						maxLength={128}
						value={inputValue}
						onChange={(e) => {
							setQuery(e.currentTarget.value);
						}}
					/>
					<InputGroupAddon align="inline-end">
						{query !== '' && (
							<InputGroupButton type="reset" variant="ghost">
								<XIcon />
								<span className="sr-only md:not-sr-only">Clear</span>
							</InputGroupButton>
						)}
						<InputGroupButton type="submit" variant="ghost">
							<SearchIcon />
							<span className="sr-only md:not-sr-only">Search</span>
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</form>
		</div>
	);
}
