import { useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { useMemo, useState } from 'react';
import { UserImage } from '@/components/user-image';
import { useAssetLightbox } from '@/hooks/use-asset-lightbox';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';

type Props = {
	className?: string;
};

const defaultBanner = 'https://i.imgur.com/EwvUEmR.jpg';

type ImageType = 'banner' | 'profile';

export function HeaderImages({ className }: Props) {
	const { profile } = useLoaderData({ from: '/u/$username' });
	const [imgType, setImgType] = useState<ImageType>('banner');

	const imgProfile = userImage(profile.image);
	const imgBanner = profile.banner ?? defaultBanner;

	const imgSrc = useMemo(() => {
		if (imgType === 'banner') {
			return imgBanner;
		}

		return imgProfile;
	}, [imgType, imgBanner, imgProfile]);

	const lb = useAssetLightbox([{ url: imgSrc }], {
		props: {
			plugins: [],
			render: {
				buttonPrev: () => null,
				buttonNext: () => null,
			},
		},
	});

	return (
		<div className={cn('relative', className)}>
			<button
				type="button"
				onClick={() => {
					setImgType('banner');
					lb.openAt(0);
				}}
				className="w-full cursor-pointer"
			>
				<Image
					src={imgBanner}
					alt=""
					className="h-64 w-full rounded-lg object-cover object-center"
					layout="constrained"
					height={256}
					aspectRatio={16 / 9}
					background="auto"
				/>
			</button>

			<button
				type="button"
				onClick={() => {
					setImgType('profile');
					lb.openAt(0);
				}}
				className="w-full cursor-pointer"
			>
				<UserImage
					src={ipx(imgProfile, 'w_512')}
					imgClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					fallbackClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					className="absolute inset-x-0 -bottom-16 mx-auto size-32 bg-white ring-4 ring-white md:mx-16"
				/>
			</button>

			<lb.Component />
		</div>
	);
}
