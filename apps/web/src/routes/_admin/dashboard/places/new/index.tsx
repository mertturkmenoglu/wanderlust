import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { FieldGroup } from '@wanderlust/ui/components/field';
import { Separator } from '@wanderlust/ui/components/separator';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { FormProvider } from 'react-hook-form';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useCreatePlaceForm } from './-hooks';
import { Step1 } from './-step-1';
import { Step2 } from './-step-2';
import { Step3 } from './-step-3';

export const Route = createFileRoute('/_admin/dashboard/places/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useCreatePlaceForm();

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Places', href: '/dashboard/places' },
					{
						name: 'New',
						href: '/dashboard/places/new',
					},
				]}
			/>

			<Separator className="my-4" />

			<FormProvider {...form}>
				<form
					className="mx-0 mt-8 max-w-7xl"
					onSubmit={form.handleSubmit((data) => {
						console.log(data);
					})}
				>
					<FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Step1 />

						<Step2 />

						<SuspenseWrapper placeholderVariant="skeleton">
							<Step3 />
						</SuspenseWrapper>

						<div />

						<div className="col-span-full flex items-center justify-end gap-2">
							<Button
								variant="default"
								type="submit"
								// disabled={createMutation.isPending || editMutation.isPending}
							>
								{
									/*(createMutation.isPending || editMutation.isPending) && */ <Spinner className="text-white!" />
								}
								<span>Create</span>
							</Button>
						</div>
					</FieldGroup>
				</form>
			</FormProvider>
		</>
	);
}
