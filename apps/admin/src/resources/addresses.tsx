import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type DataResource, defineResource, getDefaultLinks } from '@/lib/crud';
import { appLink } from '@/lib/link';
import { type Outputs, orpc } from '@/lib/orpc';

type Address = Outputs['addresses']['get']['address'];

export const addressesResource: DataResource<'addresses', Address> =
	defineResource({
		resource: 'addresses',
		breadcrumb: 'Addresses',
		links: getDefaultLinks('addresses'),

		extractors: {
			id: (accolade) => accolade.id.toString(),
			title: (address) => address.line1,
			description: (address) =>
				`${address.line1}, ${address.line2}, ${address.postalCode}`,
			appLink: (_address) => appLink('/'),
			one: (data) => data.address,
			list: (data) => data.addresses,
		},

		useOne: (input) => {
			return useQuery(
				orpc.addresses.get.queryOptions({
					input: {
						id: input.id,
					},
				}),
			);
		},

		useList: (_input) => {
			return useQuery(
				orpc.addresses.list.queryOptions({
					input: {
						page: 1,
						pageSize: 20,
					},
				}),
			);
		},

		useCreate: () => {
			const invalidate = useInvalidator();
			const navigate = useNavigate();

			return useMutation(
				orpc.addresses.create.mutationOptions({
					onSuccess: async (data) => {
						await invalidate();
						await navigate(
							addressesResource.links.details(data.address.id.toString()),
						);

						toast.success('Address created successfully');
					},
				}),
			);
		},

		useUpdate: () => {
			const invalidate = useInvalidator();

			return useMutation(
				orpc.addresses.update.mutationOptions({
					onSuccess: async () => {
						await invalidate();
						toast.success('Address updated successfully');
					},
				}),
			);
		},

		useDelete: () => {
			const navigate = useNavigate();
			const invalidate = useInvalidator();

			return useMutation(
				orpc.addresses.delete.mutationOptions({
					onSuccess: async () => {
						await navigate({
							to: addressesResource.links.list.to,
						});

						await invalidate();

						toast.success('Address deleted successfully');
					},
				}),
			);
		},
	});
