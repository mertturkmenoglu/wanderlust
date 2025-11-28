import { Link } from '@tanstack/react-router';
import { ipx } from '@/lib/ipx';

export type AutocompleteItemInfo = {
	id: string;
	name: string;
	image: string;
	categoryName: string;
	city: string;
	state: string;
};

type Props = AutocompleteItemInfo & {
	isCardClickable: boolean;
	onCardClick?: (v: AutocompleteItemInfo) => void;
};

export function Card({
	name,
	image,
	id,
	categoryName,
	city,
	state,
	isCardClickable,
	onCardClick,
}: Props) {
	const innerContent = (
		<>
			<img
				src={ipx(image, 'w_256')}
				alt=""
				className="aspect-video w-24 rounded-lg object-cover md:w-48"
			/>

			<div>
				<div className="line-clamp-1 font-semibold text-base capitalize leading-none tracking-tight md:text-lg">
					{name}
				</div>
				<div className="my-1 line-clamp-1 text-muted-foreground text-xs md:text-sm">
					{city} / {state}
				</div>

				<div className="line-clamp-1 font-semibold text-primary text-xs leading-none tracking-tight md:text-sm">
					{categoryName}
				</div>
			</div>
		</>
	);

	return (
		<div className="p-4 hover:bg-muted">
			{isCardClickable ? (
				<button
					type="button"
					onClick={() => {
						if (onCardClick) {
							onCardClick({
								categoryName,
								city,
								id,
								image,
								name,
								state,
							});
						}
					}}
					className="flex gap-2 text-left md:gap-8"
				>
					{innerContent}
				</button>
			) : (
				<Link to="/p/$id" params={{ id }} className="flex gap-2 md:gap-8">
					{innerContent}
				</Link>
			)}
		</div>
	);
}
