import { AppMessage } from '@/components/app-message';

export function SuccessState() {
	return (
		<div className="mx-auto my-16 max-w-xl">
			<AppMessage
				successMessage="Thank you for reporting this content."
				backLink="/"
				backLinkText="Back to home"
				showBackButton
			/>
		</div>
	);
}
