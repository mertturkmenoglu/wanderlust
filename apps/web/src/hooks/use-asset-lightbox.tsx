import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { ChevronLeftIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import Lightbox, {
	type LightboxExternalProps,
	useController,
} from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import type { Outputs } from '@/lib/orpc';

type Asset = Outputs['places']['get']['place']['assets'][number];

type Options = {
	props: LightboxExternalProps;
};

function NavButton({ type }: { type: 'prev' | 'next' }) {
	const controller = useController();

	return (
		<Button
			variant="midnight"
			size="icon-sm"
			className={cn('m-4! p-0!', {
				yarl__navigation_next: type === 'next',
				yarl__navigation_prev: type === 'prev',
			})}
			onClick={() => {
				if (type === 'prev') {
					controller.prev();
				} else {
					controller.next();
				}
			}}
		>
			<ChevronLeftIcon className={type === 'next' ? 'rotate-180' : ''} />
		</Button>
	);
}

export function useAssetLightbox(
	assets: (Asset | { url: string })[],
	options?: Options,
) {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	const Component = (
		<>
			<Lightbox
				open={open}
				close={() => setOpen(false)}
				slides={assets.map((m) => ({
					src: m.url,
				}))}
				plugins={[Thumbnails]}
				carousel={{
					finite: true,
				}}
				render={{
					buttonClose: () => (
						<Button variant="midnight" size="icon-sm">
							<XIcon />
						</Button>
					),
					buttonPrev: () => <NavButton type="prev" />,
					buttonNext: () => <NavButton type="next" />,
				}}
				controller={{ closeOnBackdropClick: true }}
				thumbnails={{
					vignette: false,
					imageFit: 'cover',
					position: 'bottom',
				}}
				styles={{
					container: {
						backgroundColor: 'rgba(10, 10, 10, 0.8)',
					},
					thumbnailsContainer: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
					},
				}}
				index={index}
				{...options?.props}
			/>
		</>
	);

	return {
		openAt: (i: number) => {
			setIndex(() => {
				setOpen(true);
				return i;
			});
		},
		Component: () => Component,
	};
}
