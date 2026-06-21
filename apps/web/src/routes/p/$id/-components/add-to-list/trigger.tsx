import { Button } from '@wanderlust/ui/components/button';
import { DialogTrigger } from '@wanderlust/ui/components/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon } from 'lucide-react';
import { useAddToListContext } from './context';

export function Trigger() {
	const ctx = useAddToListContext();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							onClick={() => ctx.setOpen(true)}
							size="icon"
						>
							<PlusIcon className={cn('size-6 text-primary')} />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>Add to list</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
