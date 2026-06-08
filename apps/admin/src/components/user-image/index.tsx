import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@wanderlust/ui/components/avatar';
import { cn } from '@wanderlust/ui/lib/utils';
import { useEffect, useRef } from 'react';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';

type Props = {
	className?: string;
	imgClassName?: string;
	fallbackClassName?: string;
	src: string | null;
	initials?: string | null;
};

export function UserImage({
	className,
	imgClassName,
	fallbackClassName,
	src,
	initials = '',
}: Readonly<Props>) {
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (imgRef.current) {
			imgRef.current.setAttribute('referrerpolicy', 'no-referrer');
		}
	}, []);

	return (
		<Avatar className={cn('rounded-full', className)}>
			<AvatarImage
				src={ipx(userImage(src), 'w_256') ?? ''}
				referrerPolicy="no-referrer"
				className={cn('object-cover', imgClassName)}
			/>
			<AvatarFallback
				delayMs={1000}
				className={cn(
					'rounded-full bg-linear-to-br from-sky-600 via-cyan-500 to-teal-600 font-semibold text-2xl text-white',
					fallbackClassName,
				)}
			>
				{initials ?? ''}
			</AvatarFallback>
		</Avatar>
	);
}
