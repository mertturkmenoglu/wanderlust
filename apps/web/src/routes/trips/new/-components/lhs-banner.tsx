import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { GradientText } from '@/components/gradient-text';

type Props = {
	className?: string;
};

export function LhsBanner({ className }: Props) {
	return (
		<div className={cn('flex flex-col items-center', className)}>
			<Image
				src="/trip.png"
				className="size-32 md:size-48"
				alt=""
				layout="constrained"
				width={256}
				aspectRatio={1}
			/>
			<h2 className="mx-auto mt-8 text-center font-bold text-2xl md:text-2xl">
				Plan your next trip with
				<br />
				<GradientText text="Wanderlust" />
			</h2>
		</div>
	);
}
