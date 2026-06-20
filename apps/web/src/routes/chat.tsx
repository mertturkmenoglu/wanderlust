import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/chat')({
	component: Component,
});

function Component() {
	// Chat container
	// Height must be a fixed value for it to fill the available space and not overflow the entire page
	// Since footer is not displayed on this page, calculation is:
	// Container Height = (100% dynamic viewport height) - (header height)- (header margin) - (chat container margin)
	// If for some reason page level element heights are changed (component add/remove etc.), you must update the container height calculation here as well.
	return (
		<div className="my-8 flex h-[calc(100dvh-4.5rem-4rem)] overflow-hidden p-4">
			<Outlet />
		</div>
	);
}
