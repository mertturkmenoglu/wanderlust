export type PlaceCatalogAccessor = 'new' | 'popular' | 'featured' | 'favorites';

export type PlaceCatalogProps = {
	className?: string;
	accessor: PlaceCatalogAccessor;
};
