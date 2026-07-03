import { Button } from '@wanderlust/ui/components/button';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';

type Props = React.ComponentProps<typeof Button> & {
	action: 'create' | 'edit';
	isLoading: boolean;
};

export function SubmitButton({
	action,
	isLoading,
	className,
	...props
}: Props) {
	return (
		<Button
			type="submit"
			variant="default"
			className={cn('ml-auto max-w-fit', className)}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? (
				<span className="flex items-center gap-8">
					<Spinner className="text-white!" />
					{action === 'create' ? 'Creating...' : 'Updating...'}
				</span>
			) : action === 'create' ? (
				'Create'
			) : (
				'Update'
			)}
		</Button>
	);
}
