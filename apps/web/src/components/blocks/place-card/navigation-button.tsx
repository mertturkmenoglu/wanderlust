import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlaceCardContext } from './context';

type Props = {
	type: 'previous' | 'next';
};

export function NavigationButton({ type }: Props) {
	const ctx = usePlaceCardContext();
	const disabled =
		type === 'previous'
			? ctx.index === 0
			: ctx.index === ctx.place.assets.length - 1;

	return (
		<button
			type="button"
			className={cn(
				'-translate-y-1/2 absolute top-1/2 rounded-full bg-white p-1 opacity-0 duration-200 group-hover:opacity-80',
				{
					'left-4': type === 'previous',
					'right-4': type === 'next',
				},
			)}
			disabled={disabled}
			onClick={(e) => {
				e.preventDefault();
				ctx.setIndex((prev) => {
					return type === 'previous' ? prev - 1 : prev + 1;
				});
			}}
		>
			{type === 'previous' ? (
				<ChevronLeftIcon className="size-4 text-primary" />
			) : (
				<ChevronRightIcon className="size-4 text-primary" />
			)}
			<span className="sr-only">
				{type === 'previous' ? 'Previous' : 'Next'}
			</span>
		</button>
	);
}
