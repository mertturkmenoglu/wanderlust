import { Button } from '@wanderlust/ui/components/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wanderlust/ui/components/collapsible';
import { Separator } from '@wanderlust/ui/components/separator';
import { ChevronRightIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

type Props = {
	children: React.ReactNode;
};

export function DashboardActions({ children }: Props) {
	const [open, setOpen] = useState(true);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger asChild>
				<Button variant="secondary" className="w-full justify-start">
					{open ? (
						<ChevronUpIcon className="size-4" />
					) : (
						<ChevronRightIcon className="size-4" />
					)}
					<span className="">Actions</span>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="mt-2">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{children}</div>
				<Separator className="mt-2" />
			</CollapsibleContent>
		</Collapsible>
	);
}
