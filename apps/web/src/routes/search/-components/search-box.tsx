import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { SearchIcon, XIcon } from 'lucide-react';
import type { UseSearchBoxProps } from 'react-instantsearch';
import { useSearchBox } from '@/hooks/use-search-box';

type Props = UseSearchBoxProps;

export function SearchBox(props: Props) {
	const sb = useSearchBox({
		isSearchOnType: true,
		...props,
	});

	return (
		<div>
			<sb.Form onSubmit={sb.onSubmit} onReset={sb.onReset}>
				<InputGroup>
					<InputGroupInput
						ref={sb.ref}
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						placeholder="Search"
						spellCheck={false}
						maxLength={128}
						value={sb.value}
						onChange={(e) => {
							sb.setQuery(e.currentTarget.value);
						}}
					/>
					<InputGroupAddon align="inline-end">
						{sb.query !== '' && (
							<InputGroupButton type="reset" variant="ghost">
								<XIcon />
								<span className="sr-only md:not-sr-only">Clear</span>
							</InputGroupButton>
						)}
						<InputGroupButton type="submit" variant="default">
							<SearchIcon />
							<span className="sr-only md:not-sr-only">Search</span>
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</sb.Form>
		</div>
	);
}
