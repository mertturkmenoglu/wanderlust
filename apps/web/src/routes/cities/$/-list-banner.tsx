import { Link, useLoaderData } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ChevronRightIcon } from 'lucide-react';
import { GradientBanner } from '@/components/banner/gradient';

export function CityListBanner() {
	const { city } = useLoaderData({ from: '/cities/$/' });

	return (
		<GradientBanner
			classNames={{ root: 'mt-8' }}
			left={
				<>
					<div className="text-4xl">Create a list</div>
					<div className="text-xl">
						Create a list to track all the places you want to visit in{' '}
						{city.name}.
					</div>
				</>
			}
			right={
				<Link
					to="/lists"
					className={buttonVariants({
						size: 'lg',
						variant: 'midnight',
					})}
				>
					Take me there <ChevronRightIcon />
				</Link>
			}
		/>
	);
}
