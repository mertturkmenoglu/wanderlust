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
import Cropper from 'react-easy-crop';
import { useImageCropper } from '@/hooks/use-image-cropper';
import { useUpdateUserImageMutation } from './hooks';

type Props = {
	image: string | null;
	fallbackImage: string;
	fullName: string;
	action: 'profile' | 'banner';
};

export function UpdateImage({ image, fallbackImage, action }: Props) {
	const cropper = useImageCropper({
		initial: {
			preview: image === null ? fallbackImage : image,
			crop: { x: 0, y: 0 },
			zoom: 1,
			croppedAreaPixels: null,
		},
	});

	const mutation = useUpdateUserImageMutation();

	return (
		<div className="flex max-w-xl gap-4">
			<Dialog>
				<DialogTrigger
					render={
						<button type="button" className="group relative">
							<img
								src={cropper.preview}
								alt="Preview"
								className={cn('rounded object-cover', {
									'aspect-square size-24': action === 'profile',
									'aspect-video h-32': action === 'banner',
								})}
							/>

							<UploadIcon className="absolute inset-0 m-auto size-8 rounded bg-white p-2 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
						</button>
					}
				/>

				<DialogContent
					className={cn({
						'w-full sm:max-w-2xl': action === 'profile',
						'w-full sm:max-w-4xl': action === 'banner',
					})}
				>
					<DialogHeader>
						<DialogTitle>
							Select a new {action === 'profile' ? 'profile' : 'banner'} image
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col items-center justify-center gap-8 space-x-2 text-sm">
						<div
							className={cn('cropper relative', {
								'aspect-square w-64 sm:w-xl': action === 'profile',
								'aspect-video w-80 sm:w-2xl md:w-3xl': action === 'banner',
							})}
						>
							<Cropper
								image={cropper.preview}
								crop={cropper.crop}
								zoom={cropper.zoom}
								aspect={action === 'profile' ? 1 / 1 : 16 / 9}
								cropShape="rect"
								showGrid={true}
								onCropChange={cropper.setCrop}
								onZoomChange={cropper.setZoom}
								onCropComplete={(_croppedArea, croppedAreaPixels) => {
									cropper.setCroppedAreaPixels(croppedAreaPixels);
								}}
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
								{cropper.preview
									? 'Change selection'
									: `Upload a ${action} image`}
							</label>
							<div className="mt-2 text-muted-foreground text-xs tracking-tight">
								PNG and JPEG are supported. Maximum 5MB.
							</div>
							<input
								id={`${action}-image`}
								type="file"
								name="files"
								accept="image/jpeg,image/png,image/jpg"
								placeholder={`Upload a ${action} image`}
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];

									if (file) {
										cropper.setPreview(URL.createObjectURL(file));
									}
								}}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="default"
							onClick={async () => {
								const file = await cropper.getCroppedImage();

								if (!file) {
									return;
								}

								mutation.mutate({
									type: action,
									file: file,
								});
							}}
							disabled={mutation.isPending}
						>
							Update
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
