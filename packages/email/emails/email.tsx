import { Body, Button, Head, Html } from 'react-email';

type Props = {
	message: string;
};

export default function Email({ message }: Props) {
	return (
		<Html>
			<Head />
			<Body>
				<Button
					href="https://example.com"
					style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
				>
					Click me {message}
				</Button>
			</Body>
		</Html>
	);
}
