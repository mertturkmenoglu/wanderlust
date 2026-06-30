import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from '@wanderlust/ui/components/table';
import { cn } from '@wanderlust/ui/lib/utils';

type DetailRowProps = Omit<
	React.ComponentPropsWithoutRef<typeof TableRow>,
	'children'
> & {
	label: string;
	value: string | number | React.ReactNode;
};

export function DetailRow({
	label,
	value,
	className,
	...props
}: DetailRowProps) {
	return (
		<TableRow className={cn('flex', className)} {...props}>
			<TableCell className="flex w-32 items-center justify-center bg-muted px-8 py-1.5 font-medium">
				{label}
			</TableCell>
			<TableCell className="wrap-break-word flex items-stretch justify-start whitespace-normal text-wrap px-8 py-1.5">
				{value}
			</TableCell>
		</TableRow>
	);
}

type DetailTableProps = React.ComponentPropsWithoutRef<typeof Table>;

export function DetailTable({
	className,
	children,
	...props
}: DetailTableProps) {
	return (
		<Table className={cn('w-full table-fixed', className)} {...props}>
			<TableBody>{children}</TableBody>
		</Table>
	);
}
