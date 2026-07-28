import { useItineraryContext } from '../hooks';
import { options } from '../options';

export function SelectionView() {
	const ctx = useItineraryContext();

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
			{options.map((option) => (
				<button
					key={option.type}
					type="button"
					onClick={() => ctx.setType(option.type)}
					className="flex aspect-video flex-col items-start justify-center gap-1 rounded p-2 pl-4 outline hover:bg-muted"
				>
					<option.icon className="size-7 text-primary" />
					<span className="font-medium text-muted-foreground text-sm">
						{option.label}
					</span>
				</button>
			))}
		</div>
	);
}
