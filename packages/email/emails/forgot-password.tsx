import {
	Body,
	Button,
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

type Props = {
	firstName: string;
	resetPasswordUrl: string;
};

export default function ForgotPasswordEmail({
	firstName,
	resetPasswordUrl,
}: Props) {
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
					<Preview>Wanderlust - Reset your password</Preview>
					<Container className="border border-[#f0f0f0] border-solid bg-white p-[45px]">
						<Img
							src="https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/refs/heads/main/apps/web/public/logo.png"
							width="48"
							height="48"
							alt="Wanderlust"
						/>
						<Section className="font-sans">
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								Hi {firstName},
							</Text>
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								Someone recently requested a password change for your Wanderlust
								account. If this was you, you can set a new password here:
							</Text>
							<Button
								className="block w-[210px] rounded bg-brand px-[7px] py-3.5 text-center text-[15px] text-white no-underline"
								href={resetPasswordUrl}
							>
								Reset password
							</Button>
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								If you did not make this request, please contact our help team.
								If you think you accidentally got this email, please discard it.
								Thanks!
							</Text>
							<Text className="text-base text-brand leading-[26px]">
								Wanderlust Team
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

ForgotPasswordEmail.PreviewProps = {
	firstName: 'John',
	resetPasswordUrl: 'https://example.com',
} satisfies Props;
