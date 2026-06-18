import { useMutation } from '@tanstack/react-query';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { cn } from '@wanderlust/ui/lib/utils';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

type Props = {
	image: string | null;
	fallbackImage: string;
	fullName: string;
	action: 'profile' | 'banner';
};

export function UpdateImage({ image, fallbackImage, fullName, action }: Props) {
	const [preview, setPreview] = useState(() =>
		image === null ? fallbackImage : image,
	);
	const [file, setFile] = useState<File | null>(null);
	const mutation = useMutation(
		orpc.users.updateImage.mutationOptions({
			onSuccess: async (res) => {
				await authClient.updateUser({
					image: res.profile.image,
				});
				toast.success('Image updated');
				globalThis.window.location.reload();
			},
		}),
	);

	return (
		<div className="flex max-w-xl gap-4">
			<Dialog>
				<DialogTrigger asChild>
					<button type="button" className="group relative">
						<img
							src={preview}
							alt="Preview"
							className={cn('rounded object-cover', {
								'aspect-square size-24': action === 'profile',
								'aspect-video h-32': action === 'banner',
							})}
						/>

						<UploadIcon className="absolute inset-0 m-auto size-8 rounded bg-white p-2 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
					</button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>
							Select a new {action === 'profile' ? 'profile' : 'banner'} image
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col items-center justify-center gap-8 space-x-2 text-sm">
						<div className="flex flex-col items-center gap-4">
							<img
								src={preview}
								alt={fullName}
								className={cn('mt-4 rounded-md object-cover', {
									'aspect-square w-48': action === 'profile',
									'aspect-video w-80': action === 'banner',
								})}
							/>
						</div>
						<div className="flex flex-col">
							<label
								htmlFor={`${action}-image`}
								className={cn(
									'mr-4 rounded-md border-0 bg-primary/10 px-4 py-2 font-semibold text-sm',
									'cursor-pointer text-primary hover:bg-primary/20',
									'flex items-center justify-center gap-4 transition-colors',
								)}
							>
								<UploadIcon className="size-4 text-primary" />
								{file ? 'Change selection' : `Upload a ${action} image`}
							</label>
							<div className="mt-2 text-muted-foreground text-xs">
								PNG, JPEG, and WebP are supported. Maximum 5MB.
							</div>
							<input
								id={`${action}-image`}
								type="file"
								name="files"
								accept="image/jpeg,image/png,image/jpg,image/webp"
								placeholder={`Upload a ${action} image`}
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];

									if (file) {
										setPreview(URL.createObjectURL(file));
										setFile(file);
									}
								}}
							/>
						</div>
					</div>
					<DialogFooter className="sm:justify-center">
						<Button
							type="button"
							variant="default"
							onClick={async () => {
								if (!file) {
									return;
								}

								mutation.mutate({
									type: action,
									file: file,
								});
							}}
							disabled={!file || mutation.isPending}
						>
							Update
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
