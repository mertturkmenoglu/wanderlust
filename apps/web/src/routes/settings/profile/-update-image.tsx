import { UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
	const mutation = api.useMutation('post', '/api/v2/users/image/{type}', {
		onSuccess: () => {
			toast.success('Image updated');
			globalThis.window.location.reload();
		},
	});

	return (
		<div className="ml-auto flex max-w-xl gap-4">
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="link">Change {action} image</Button>
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
								PNG, JPEG, GIF, and WebP are supported. Maximum 5MB.
							</div>
							<input
								id={`${action}-image`}
								type="file"
								name="files"
								accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
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

								const form = new FormData();

								form.append('files', file);

								const ext = file.type.split('/')[1];

								if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
									toast.error('Only PNG, JPG, and JPEG are supported');
									return;
								}

								// Get presigned URL
								const res = await fetchClient.GET('/api/v2/assets/upload/', {
									params: {
										query: {
											assetType: 'image',
											bucket:
												action === 'profile'
													? 'profile-images'
													: 'banner-images',
											fileExt: ext,
										},
									},
								});

								if (res.error) {
									toast.error('Something went wrong');
									return;
								}

								// Upload file to S3
								const s3Res = await fetch(
									`${res.data.url}&bucket=profile-images`,
									{
										method: 'PUT',
										body: file,
									},
								);

								if (!s3Res.ok) {
									toast.error('Something went wrong');
									return;
								}

								mutation.mutate({
									params: {
										path: {
											type: action,
										},
									},
									body: {
										id: res.data.id,
										fileName: `${res.data.id}.${ext}`,
									},
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
