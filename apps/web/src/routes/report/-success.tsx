import { AppMessage } from '@/components/app-message';

export function SuccessState() {
	return (
		<div className="mx-auto my-16 max-w-xl">
			<AppMessage
				success="Thank you for reporting this content."
				backLink={{
					to: '/',
					text: 'Back to home',
				}}
			/>
		</div>
	);
}
