import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { useCallback, useRef, useState } from 'react';

export type ConfirmDialogOptions = {
	title?: string;
	description?: React.ReactNode;
	confirmText?: string;
	cancelText?: string;
	variant?: 'default' | 'destructive';
	className?: string;
};

export function useConfirmDialog() {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmDialogOptions>({});
	const resolveRef = useRef<((value: boolean) => void) | null>(null);

	const confirm = useCallback((opts: ConfirmDialogOptions = {}) => {
		setOptions(opts);
		setOpen(true);

		return new Promise<boolean>((resolve) => {
			resolveRef.current = resolve;
		});
	}, []);

	const handleConfirm = () => {
		resolveRef.current?.(true);
		setOpen(false);
	};

	const handleCancel = () => {
		resolveRef.current?.(false);
		setOpen(false);
	};

	const Dialog = (
		<AlertDialog open={open} onOpenChange={(o) => !o && handleCancel()}>
			<AlertDialogContent className={options.className}>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{options.title ?? 'Are you sure?'}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{options.description ?? 'This action cannot be undone.'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>
						{options.cancelText ?? 'Cancel'}
					</AlertDialogCancel>

					<Button
						onClick={handleConfirm}
						variant={
							options.variant === 'destructive' ? 'destructive' : 'default'
						}
					>
						{options.confirmText ?? 'Continue'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	return { confirm, Dialog };
}
