import { cn } from '@wanderlust/ui/lib/utils';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { useChatImage, useChatTitle } from './hooks';
import { Menu } from './menu';

type Props = {
	className?: string;
};

export function Header({ className }: Props) {
	const title = useChatTitle();
	const image = useChatImage();

	return (
		<div
			className={cn(
				'flex flex-row items-center justify-between gap-4',
				className,
			)}
		>
			<div className="flex flex-row items-center gap-4">
				<UserImage src={userImage(image)} className="h-8 w-8 rounded-full" />
				<div className="text-lg">{title}</div>
			</div>

			<div>
				<Menu />
			</div>
		</div>
	);
}
