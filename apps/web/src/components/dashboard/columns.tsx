import type { ColumnDef } from '@tanstack/react-table';

type KeyValueCols = {
	k: string;
	v: React.ReactNode;
};

const keyValueCols: ColumnDef<KeyValueCols>[] = [
	{
		accessorKey: 'k',
		header: 'Key',
	},
	{
		accessorKey: 'v',
		header: 'Value',
		cell: ({ row }) => <div className="w-full">{row.getValue('v')}</div>,
	},
];

type Place = {
	id: string;
	name: string;
	city: string;
	country: string;
	category: string;
};

const placesCols: ColumnDef<Place>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'city',
		header: 'City',
	},
	{
		accessorKey: 'country',
		header: 'Country',
	},
	{
		accessorKey: 'category',
		header: 'Category',
	},
];

type Report = {
	id: string;
	resourceId: string;
	resourceType: string;
	reporterId: string | null;
	description: string | null;
	reason: string;
	resolved: string;
	resolvedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

const reportsCols: ColumnDef<Report>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'resourceId',
		header: 'Resource ID',
	},
	{
		accessorKey: 'resourceType',
		header: 'Resource Type',
	},
	{
		accessorKey: 'reporterId',
		header: 'Reporter ID',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'reason',
		header: 'Reason',
	},
	{
		accessorKey: 'resolved',
		header: 'Resolved',
	},
	{
		accessorKey: 'resolvedAt',
		header: 'Resolved At',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated At',
	},
];

type PlaceDraft = {
	id: string;
	name: string;
	v: number;
};

const placeDraftCols: ColumnDef<PlaceDraft>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'v',
		header: 'Version',
	},
];

type City = {
	id: number;
	name: string;
	stateName: string;
	stateCode: string;
	countryName: string;
	countryCode: string;
};

const citiesCols: ColumnDef<City>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'stateName',
		header: 'State',
	},
	{
		accessorKey: 'stateCode',
		header: 'State Code',
	},
	{
		accessorKey: 'countryName',
		header: 'Country',
	},
	{
		accessorKey: 'countryCode',
		header: 'Country Code',
	},
];

type Collection = {
	id: string;
	name: string;
	description: string;
	createdAt: string;
};

const collectionsCols: ColumnDef<Collection>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
	},
];

type User = {
	id: string;
	name: string;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

const usersCols: ColumnDef<User>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'username',
		header: 'Username',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated At',
	},
];

export {
	type City,
	type Collection,
	citiesCols,
	collectionsCols,
	type KeyValueCols,
	keyValueCols,
	type Place,
	type PlaceDraft,
	placeDraftCols,
	placesCols,
	type Report,
	reportsCols,
	type User,
	usersCols,
};
