import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Activity, useEffect, useState } from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { AddressSearch } from './-address-search';
import type { FormInput, NewAddressFormInput } from './-hooks';

export function Step4() {
	const form = useFormContext<FormInput>();
	const [mode, setMode] = useState<'new' | 'select' | 'view'>('new');

	return (
		<div className="col-span-full">
			<div className="flex items-center justify-between">
				<div>
					<FieldLegend>Address</FieldLegend>
					<FieldDescription>
						Select an address or create a new one
					</FieldDescription>
				</div>
				<ButtonGroup>
					<Button
						variant={mode === 'new' ? 'default' : 'outline'}
						onClick={() => setMode('new')}
						type="button"
					>
						New
					</Button>
					<Button
						variant={mode === 'select' ? 'default' : 'outline'}
						onClick={() => setMode('select')}
						type="button"
					>
						Select
					</Button>
				</ButtonGroup>
			</div>

			<Activity mode={mode === 'new' ? 'visible' : 'hidden'}>
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit((data) => {
							console.log(data);
						})}
					>
						<FieldGroup>
							<Controller
								name="line1"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="name">Name</FieldLabel>
										<Input
											{...field}
											id="name"
											placeholder="Name"
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</FormProvider>
			</Activity>

			<Activity mode={mode === 'select' ? 'visible' : 'hidden'}>
				<SuspenseWrapper>
					<AddressSearch />
				</SuspenseWrapper>
			</Activity>
		</div>
	);
}
