import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { ConstructionIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '../logo';

export function WipComponent() {
	const isMobile = useIsMobile();

	return (
		<div className="my-8 flex flex-col-reverse items-center justify-center md:my-64 md:gap-24 lg:mx-32 lg:flex-row lg:gap-48">
			<div className="text-midnight">
				<div className="flex items-center gap-2">
					<ConstructionIcon className="size-8" />
					<div className="font-bold text-2xl">Oopss</div>
				</div>
				<div className="mt-4 font-bold text-2xl md:text-6xl">
					Work in Progress
				</div>
				<div className="mt-8 text-xl">
					Sorry for the inconvenience, but this page is still under
					construction.
				</div>
				<div>
					Our team is working like a squirrel 🐿️ to get it done. Check back
					later.
				</div>
				<Link
					to="/"
					className={buttonVariants({ variant: 'midnight', className: 'mt-8' })}
				>
					Country roads take me home
				</Link>
			</div>
			<div>
				<Logo variant={isMobile ? 'default' : 'large'} grayscale />
			</div>
		</div>
	);
}
