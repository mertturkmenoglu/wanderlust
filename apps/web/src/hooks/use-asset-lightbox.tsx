import { useState } from 'react';
import Lightbox, {
	type LightboxExternalProps,
} from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import type { Outputs } from '@/lib/orpc';

type Asset = Outputs['places']['get']['place']['assets'][number];

type Options = {
	props: LightboxExternalProps;
};

export function useAssetLightbox(
	assets: (Asset | { url: string })[],
	options?: Options,
) {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	const Component = (
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
			controller={{
				closeOnBackdropClick: true,
			}}
			styles={{
				container: {
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
				},
			}}
			index={index}
			{...options?.props}
		/>
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
