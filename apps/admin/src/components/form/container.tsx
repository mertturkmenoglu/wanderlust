import {
	FieldGroup,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';

type Props = React.ComponentProps<typeof FieldSet> & {
	action: 'create' | 'edit';
};

export function FormContainer({ action, children, ...props }: Props) {
	return (
		<FieldSet {...props}>
			<FieldLegend className="capitalize">{action}</FieldLegend>

			<FieldGroup>{children}</FieldGroup>
		</FieldSet>
	);
}
