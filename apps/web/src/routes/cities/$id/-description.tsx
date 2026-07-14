import { tz } from '@date-fns/tz';
import { useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';
import { Attribution } from '@/components/attribution';
import { ipx } from '@/lib/ipx';

export function Description() {
	const { city } = useLoaderData({ from: '/cities/$id/' });

	return (
		<div className="mt-4 grid grid-cols-5 gap-4 md:mt-8 md:gap-8">
			<div className="col-span-5 lg:col-span-2">
				<div className="relative">
					<Image
						src={ipx(city.image, 'w_512')}
						alt=""
						className="aspect-video rounded-md object-cover"
						width={512}
						aspectRatio={16 / 9}
					/>
					<Attribution attributions={city.attributions} />
				</div>
			</div>

			<div className="col-span-5 lg:col-span-3">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="font-bold text-3xl md:text-6xl">{city.name}</h2>
						<div className="mt-2 text-muted-foreground text-sm md:font-semibold md:text-base">
							{city.stateName}/{city.countryName}
						</div>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={buttonVariants({ variant: 'outline', size: 'sm' })}
							>
								<ClockIcon />
								<div>
									{format(new Date(), 'HH:mm', {
										in: tz(city.timezone),
									})}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent side="left">
							{city.name}'s current time
						</TooltipContent>
					</Tooltip>
				</div>

				<div className="mt-4 text-base text-muted-foreground md:text-lg">
					{city.description}
				</div>
			</div>
		</div>
	);
}
