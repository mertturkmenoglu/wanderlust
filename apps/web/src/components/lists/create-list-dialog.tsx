import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@wanderlust/ui/components/button';
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { type Outputs, orpc } from '@/lib/orpc';

type Props = {
	children: React.ReactNode;
	onSuccess: (data: Outputs['lists']['create']) => Promise<void>;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const schema = z.object({
	name: z.string().min(1).max(128),
	isPublic: z.boolean(),
});

export function CreateListDialog({
	children,
	onSuccess,
	open,
	setOpen,
}: Props) {
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			isPublic: false,
		},
	});

	const mutation = useMutation(
		orpc.lists.create.mutationOptions({
			onSuccess,
		}),
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Create a List</DialogTitle>
				</DialogHeader>

				<form
					id="create-list-form"
					onSubmit={form.handleSubmit((data) => {
						mutation.mutate(data);
					})}
				>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										{...field}
										id="name"
										placeholder="Name"
										autoComplete="off"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="isPublic"
							control={form.control}
							render={({ field, fieldState }) => (
								<FieldSet data-invalid={fieldState.invalid}>
									<FieldLegend variant="label">Visibility</FieldLegend>
									<FieldDescription>
										Making your list public allows other users to view it.
									</FieldDescription>
									<FieldGroup data-slot="checkbox-group">
										<Field orientation="horizontal">
											<Checkbox
												id="is-public"
												name={field.name}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
											<FieldLabel htmlFor="is-public" className="font-normal">
												Public list
											</FieldLabel>
										</Field>
									</FieldGroup>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</FieldSet>
							)}
						/>
					</FieldGroup>
				</form>

				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>

					<Button
						type="submit"
						form="create-list-form"
						variant="default"
						disabled={mutation.isPending}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
