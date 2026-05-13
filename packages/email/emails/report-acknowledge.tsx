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

export default function ReportAcknowledgeEmail() {
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
					<Preview>Wanderlust - Report Acknowledgement</Preview>
					<Container className="border border-[#f0f0f0] border-solid bg-white p-11.25">
						<Img src={logoUrl} width="48" height="48" alt="Wanderlust" />
						<Section className="font-sans">
							<Text className="font-light text-[#404040] text-base leading-6.5">
								We received your report.
							</Text>
							<Text className="font-light text-[#404040] text-base leading-6.5">
								Thank you for reporting unwanted content on Wanderlust. We will
								review your report and take the appropriate action.
							</Text>
							<Text className="font-light text-[#404040] text-base leading-6.5">
								If you have any questions, please contact our help team. If you
								think you accidentally got this email, please discard it.
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

ReportAcknowledgeEmail.PreviewProps = {};
