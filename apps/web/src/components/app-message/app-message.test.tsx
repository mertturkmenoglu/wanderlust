import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/test/render-with-router';
import { AppMessage } from '.';

describe('Components/AppMessage', () => {
	test('happy path', async () => {
		const screen = await renderWithRouter(<AppMessage />);

		expect(screen.getByTestId('app-message')).toBeInTheDocument();
	});

	test('message should be rendered', async () => {
		const errorMessage = 'Error message';
		const screen = await renderWithRouter(<AppMessage error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	test('back link should be rendered', async () => {
		const backLinkText = 'Back';
		const screen = await renderWithRouter(
			<AppMessage
				backLink={{
					to: '/',
					text: backLinkText,
				}}
			/>,
		);

		expect(screen.getByText(backLinkText)).toBeInTheDocument();
	});

	test('back link should not be rendered when backLink is false', async () => {
		const screen = await renderWithRouter(<AppMessage backLink={false} />);

		expect(
			screen.getByTestId('app-message').element().querySelector('a'),
		).not.toBeInTheDocument();
	});

	test('back link should have the correct href', async () => {
		const backLinkText = 'Back';
		const screen = await renderWithRouter(
			<AppMessage
				backLink={{
					to: '/help',
					text: backLinkText,
				}}
			/>,
		);

		expect(
			screen.getByText(backLinkText).element(),
		).toHaveAttribute('href', '/help');
	});

	test('variant=error should be set correctly', async () => {
		const screen = await renderWithRouter(<AppMessage error="Error" />);

		expect(screen.getByTestId('app-message')).toHaveAttribute(
			'data-variant',
			'error',
		);
	});

	test('variant=success should be set correctly', async () => {
		const screen = await renderWithRouter(<AppMessage success="Success" />);

		expect(screen.getByTestId('app-message')).toHaveAttribute(
			'data-variant',
			'success',
		);
	});

	test('variant=empty should be set correctly', async () => {
		const screen = await renderWithRouter(<AppMessage empty="Empty" />);

		expect(screen.getByTestId('app-message')).toHaveAttribute(
			'data-variant',
			'empty',
		);
	});

	test('error should take precedence over success and empty', async () => {
		const screen = await renderWithRouter(
			<AppMessage error="Error" success="Success" empty="Empty" />,
		);

		expect(screen.getByTestId('app-message')).toHaveAttribute(
			'data-variant',
			'error',
		);
	});

	test('success should take precedence over empty', async () => {
		const screen = await renderWithRouter(
			<AppMessage success="Success" empty="Empty" />,
		);

		expect(screen.getByTestId('app-message')).toHaveAttribute(
			'data-variant',
			'success',
		);
	});

	test('root className should be applied', async () => {
		const rootClassName = 'root-class';
		const screen = await renderWithRouter(
			<AppMessage classNames={{ root: rootClassName }} />,
		);

		expect(screen.getByTestId('app-message')).toHaveClass(rootClassName);
	});

	test('logo className should be applied', async () => {
		const logoClassName = 'logo-class';
		const screen = await renderWithRouter(
			<AppMessage classNames={{ logo: logoClassName }} />,
		);

		expect(
			screen.getByTestId('app-message').element().querySelector('img'),
		).toHaveClass(logoClassName);
	});

	test('logo props should be applied', async () => {
		const screen = await renderWithRouter(
			<AppMessage
				logoProps={{
					grayscale: true,
				}}
			/>,
		);

		expect(
			screen.getByTestId('app-message').element().querySelector('img'),
		).toHaveClass('grayscale');
	});
});
