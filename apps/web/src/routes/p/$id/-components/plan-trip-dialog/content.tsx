import { useLoaderData } from '@tanstack/react-router';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { MapIcon, XIcon } from 'lucide-react';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { AddToTripView } from './add-to-trip-view';
import { ChooseView } from './choose-view';
import { usePlanTripDialogContext } from './context';
import { useNavigationGuard } from './hooks';
import type { PlanTripDialogProps } from './types';

export function Content({ className }: PlanTripDialogProps) {
	const { place } = useLoaderData({ from: '/p/$id/' });
	const ctx = usePlanTripDialogContext();

	useNavigationGuard();

	return (
		<AlertDialog
			open={ctx.open}
			onOpenChange={(o) => {
				ctx.setView('choose');
				ctx.setOpen(o);
			}}
		>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" onClick={() => ctx.setOpen(true)}>
					<MapIcon className="size-6 text-primary" />
					<span className="text-primary">Plan a trip</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className={cn(className)}>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center justify-between gap-2">
						<span>Plan a Trip to {place.name}</span>
						<Button variant="ghost" onClick={() => ctx.setOpen(false)}>
							<XIcon className="size-4 text-muted-foreground" />
						</Button>
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="">
					{ctx.view === 'choose' && <ChooseView />}
					{ctx.view === 'add-to-trip' && (
						<SuspenseWrapper>
							<AddToTripView />
						</SuspenseWrapper>
					)}
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	);
}
