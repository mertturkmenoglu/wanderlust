import { Field, FieldLabel } from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { ScrollArea } from '@wanderlust/ui/components/scroll-area';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { AppMessage } from '@/components/app-message';
import { AddressSearchItem } from './-address-search-item';
import { useSearchQuery, useSearchTerm } from './-hooks';

export function AddressSearch() {
	const [searchTerm, setSearchTerm, debouncedSearchTerm] = useSearchTerm();
	const searchQuery = useSearchQuery(debouncedSearchTerm);

	const searchInputField = (
		<Field className="mt-4">
			<FieldLabel htmlFor="addressSearch">Search an Address</FieldLabel>
			<Input
				id="addressSearch"
				placeholder="Search an address by line or postcode"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
		</Field>
	);

	if (searchQuery.isLoading) {
		return (
			<>
				{searchInputField}

				<Spinner className="mx-auto mt-2" />
			</>
		);
	}

	if (searchQuery.isError) {
		return (
			<>
				{searchInputField}

				<AppMessage
					showBackButton={false}
					errorMessage="Failed to search addresses"
				/>
			</>
		);
	}

	if (searchQuery.data) {
		const addresses = searchQuery.data.addresses;

		if (addresses.length === 0) {
			return (
				<>
					{searchInputField}

					<AppMessage
						showBackButton={false}
						emptyMessage="No addresses found"
					/>
				</>
			);
		}

		return (
			<>
				{searchInputField}

				<div className="mt-2">
					<ScrollArea className="h-96 px-4">
						<ItemGroup className="mt-2 grid gap-2 md:grid-cols-3">
							{addresses.map((address) => (
								<AddressSearchItem key={address.id} address={address} />
							))}
						</ItemGroup>
					</ScrollArea>
				</div>
			</>
		);
	}

	return searchInputField;
}
