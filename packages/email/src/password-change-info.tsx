import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Preview,
	pixelBasedPreset,
	Section,
	Tailwind,
	Text,
} from 'react-email';
import { logoUrl } from './common';

type Props = {
	firstName: string;
};

export function PasswordChangeInfoEmail({ firstName }: Props) {
	return (
		<Html>
			<Head />
			<Tailwind
				config={{
					presets: [pixelBasedPreset],
					theme: {
						extend: {
							colors: {
								brand: '#18815e',
							},
						},
					},
				}}
			>
				<Body className="bg-[#f6f9fc] py-2.5">
					<Preview>Wanderlust - Password Changed</Preview>
					<Container className="border border-[#f0f0f0] border-solid bg-white p-11.25">
						<Img src={logoUrl} width="48" height="48" alt="Wanderlust" />
						<Section className="font-sans">
							<Text className="font-light text-[#404040] text-base leading-6.5">
								Hi {firstName},
							</Text>
							<Text className="font-light text-[#404040] text-base leading-6.5">
								Your account password has been changed. If you did not make this
								change, please contact our help team immediately. If you think
								you accidentally got this email, please discard it. Thanks!
							</Text>
							<Text className="text-base text-brand leading-6.5">
								Wanderlust Team
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

PasswordChangeInfoEmail.PreviewProps = {
	firstName: 'John',
} satisfies Props;
