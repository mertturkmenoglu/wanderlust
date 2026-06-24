import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { SearchIcon, XIcon } from 'lucide-react';
import type { UseSearchBoxProps } from 'react-instantsearch';
import { useSearchBox } from '@/hooks/use-search-box';
import { useSearchContext } from './context';
import { useInputPlaceholder } from './hooks';

type Props = UseSearchBoxProps;

export function SearchBox(props: Props) {
	const ctx = useSearchContext();
	const placeholder = useInputPlaceholder();

	const sb = useSearchBox({
		isSearchOnType: true,
		...props,
	});

	return (
		<div>
			<sb.Form
				onSubmit={sb.onSubmit}
				onReset={sb.onReset}
				onFocus={() => {
					ctx.setIsDropdownOpen(true);
				}}
			>
				<InputGroup
					className={cn({
						'group h-10 rounded-full pr-1 pl-2 focus-within:rounded-md md:h-14 md:pl-4':
							ctx.variant === 'global',
					})}
				>
					<InputGroupInput
						ref={sb.ref}
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						className={cn({
							'rounded-md': ctx.variant === 'global',
						})}
						placeholder={placeholder}
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
						<InputGroupButton
							type="submit"
							variant="default"
							className={cn({
								'h-8 rounded-full px-2.5! md:h-10 md:px-4!':
									ctx.variant === 'global',
							})}
						>
							<SearchIcon />
							<span
								className={cn('sr-only md:not-sr-only', {
									'md:ml-2!': ctx.variant === 'global',
								})}
							>
								Search
							</span>
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</sb.Form>
		</div>
	);
}
