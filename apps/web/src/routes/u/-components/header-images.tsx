import { useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';

type Props = {
	className?: string;
};

const defaultBanner = 'https://i.imgur.com/EwvUEmR.jpg';

export function HeaderImages({ className }: Props) {
	const { profile } = useLoaderData({ from: '/u/$username' });
	const [open, setOpen] = useState(false);
	const [imgType, setImgType] = useState<'banner' | 'profile'>('banner');
	const imgSrc =
		imgType === 'banner'
			? (profile.banner ?? defaultBanner)
			: userImage(profile.image);

	return (
		<div className={cn('relative', className)}>
			<button
				type="button"
				onClick={() => {
					setOpen(true);
					setImgType('banner');
				}}
				className="w-full cursor-pointer"
			>
				<Image
					src={profile.banner ?? defaultBanner}
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
					setOpen(true);
					setImgType('profile');
				}}
				className="w-full cursor-pointer"
			>
				<UserImage
					src={ipx(userImage(profile.image), 'w_512')}
					imgClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					fallbackClassName="size-48 md:size-32 ring-4 ring-white bg-white"
					className="absolute inset-x-0 -bottom-16 mx-auto size-32 bg-white ring-4 ring-white md:mx-16"
				/>
			</button>

			<Lightbox
				open={open}
				close={() => setOpen(false)}
				slides={[
					{
						src: imgSrc,
					},
				]}
				animation={{ fade: 0 }}
				render={{
					buttonPrev: () => null,
					buttonNext: () => null,
				}}
				controller={{
					closeOnPullDown: true,
					closeOnBackdropClick: true,
				}}
				styles={{
					container: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
					},
				}}
			/>
		</div>
	);
}
