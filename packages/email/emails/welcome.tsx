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
import { logoUrl, websiteUrl } from './common';

type Props = {
	firstName: string;
};

export default function WelcomeEmail({ firstName }: Props) {
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
					<Preview>Wanderlust - Welcome</Preview>
					<Container className="border border-[#f0f0f0] border-solid bg-white p-[45px]">
						<Img src={logoUrl} width="48" height="48" alt="Wanderlust" />
						<Section className="font-sans">
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								Hi {firstName},
							</Text>
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								Welcome aboard! We are so happy to see you.
							</Text>
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								Here are some quick tips to get you started:
							</Text>
							<ul>
								<li>
									<Text className="font-light text-[#404040] text-base">
										Explore popular places and curated collections
									</Text>
								</li>
								<li>
									<Text className="font-light text-[#404040] text-base">
										Create your first trip
									</Text>
								</li>
								<li>
									<Text className="font-light text-[#404040] text-base">
										Invite friends
									</Text>
								</li>
							</ul>
							<Button
								className="block w-[210px] rounded bg-brand px-[7px] py-3.5 text-center text-[15px] text-white no-underline"
								href={websiteUrl}
							>
								Explore Wanderlust
							</Button>
							<Text className="font-light text-[#404040] text-base leading-[26px]">
								Get started by exploring our features and planning your next
								adventure.
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

WelcomeEmail.PreviewProps = {
	firstName: 'John',
} satisfies Props;
