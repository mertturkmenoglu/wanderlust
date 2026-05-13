import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { HeartIcon } from 'lucide-react';
import { ipx } from '@/lib/ipx';

type TItem = {
	id: string;
	title: string;
	category: string;
	favorite: boolean;
	image: string;
};

type Props = {
	className?: string;
	title: string;
	actions?: React.ReactNode;
	items: TItem[];
};

export function Collection({ className, title, actions, items }: Props) {
	return (
		<div className={cn('w-full', className)}>
			<div className="flex items-baseline">
				<h2 className="font-bold text-2xl">{title}</h2>
				{actions && <div>{actions}</div>}
			</div>

			<div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{items.map((item) => (
					<div key={item.id}>
						<div className="relative">
							<Image
								src={ipx(item.image, 'w_512')}
								alt=""
								className="aspect-video w-full rounded-md object-cover"
								layout="constrained"
								width={512}
								aspectRatio={16 / 9}
							/>
							<button
								type="button"
								className="absolute top-1 right-1 rounded-full bg-white p-1"
							>
								<HeartIcon
									className={cn('size-4 text-primary', {
										'fill-primary': item.favorite,
									})}
								/>
							</button>
						</div>
						<div className="mt-2 line-clamp-1 font-semibold">{item.title}</div>
						<div className="text-muted-foreground text-sm">{item.category}</div>
					</div>
				))}
			</div>
		</div>
	);
}
