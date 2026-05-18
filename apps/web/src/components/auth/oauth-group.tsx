import { Field } from '@wanderlust/ui/components/field';
import { OAuthButton } from './oauth-button';

export function OAuthGroup() {
	return (
		<Field className="grid grid-cols-1 sm:grid-cols-2">
			<OAuthButton provider="google" />
			<OAuthButton provider="facebook" />
		</Field>
	);
}
