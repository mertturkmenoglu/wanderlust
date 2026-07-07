import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { PlusIcon } from 'lucide-react';
import z from 'zod';
import { EditDialog } from '@/components/edit-dialog';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { collectionsResource as r } from '@/resources/collections';

export const Route = createFileRoute('/dashboard/collections/$id/relations')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	validateSearch: z.object({
		mode: z.enum(['place', 'city']).optional().catch('place'),
	}),
	staticData: getDefaultStaticData(r, 'edit'),
});

function RouteComponent() {
	const params = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<EditDialog id={params.id} resource={r}>
			<div className="flex flex-row items-stretch justify-start gap-4">
				<ButtonGroup>
					<Button
						variant={
							search.mode === 'place' || search.mode === undefined
								? 'default'
								: 'outline'
						}
						onClick={() => navigate({ search: { mode: 'place' } })}
						className="w-64"
					>
						Places
					</Button>
					<Button
						variant={search.mode === 'city' ? 'default' : 'outline'}
						onClick={() => navigate({ search: { mode: 'city' } })}
						className="w-64"
					>
						Cities
					</Button>
				</ButtonGroup>
				<Button>
					<PlusIcon />
					New
				</Button>
			</div>
		</EditDialog>
	);
}
