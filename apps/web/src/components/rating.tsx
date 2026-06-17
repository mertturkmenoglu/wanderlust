import { cn } from '@wanderlust/ui/lib/utils';
import * as rating from '@zag-js/rating-group';
import { normalizeProps, useMachine } from '@zag-js/react';
import { StarIcon } from 'lucide-react';

type Props = {
	id: string;
	value?: number;
	onChange: ({ value }: { value: number }) => void;
	onHoverChange?: (details: rating.HoverChangeDetails) => void;
	defaultValue?: number;
	disabled?: boolean;
	starsClassName?: string;
};

export function Rating({
	id,
	value,
	onChange,
	onHoverChange,
	defaultValue,
	disabled = false,
	starsClassName,
}: Props) {
	const service = useMachine(rating.machine, {
		id,
		allowHalf: false,
		value,
		defaultValue,
		disabled,
		onValueChange: onChange,
		onHoverChange: onHoverChange,
	});

	const api = rating.connect(service, normalizeProps);

	return (
		<div {...api.getRootProps()}>
			<div {...api.getControlProps()} className="flex">
				{api.items.map((index) => {
					const state = api.getItemState({ index });
					return (
						<span key={index} {...api.getItemProps({ index })}>
							<StarIcon
								className={cn(
									'size-4 text-primary',
									{
										'fill-primary': state.highlighted || state.checked,
									},
									starsClassName,
								)}
							/>
						</span>
					);
				})}
			</div>
			<input {...api.getHiddenInputProps()} data-testid="hidden-input" />
		</div>
	);
}
