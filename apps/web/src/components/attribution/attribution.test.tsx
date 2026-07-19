import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/test/render-with-router';
import { Attribution } from '.';

// This test suite is broken at the moment.
// I would like to test the user interaction with the hover card, but I couldn't
// figure it out how to do it without spending a couple hundred milliseconds on each test.
// FIXME: Tests take a lot of time to run because of hover delay. Find a way to bypass the delay.
describe.skip('Components/Attribution', () => {
	test('should not render if it is not hovered', async () => {
		const screen = await renderWithRouter(
			<Attribution attributions={[]} delay={0} />,
		);

		await expect
			.element(screen.getByTestId('attribution-hover-card'))
			.not.toBeInTheDocument();
	});

	test("should render if it is hovered for more than trigger's delay", async () => {
		const screen = await renderWithRouter(
			<Attribution attributions={[]} delay={0} />,
		);

		await screen.getByTestId('attribution-hover-trigger').hover({
			timeout: 300, // Somehow it still needs ~70ms to render, so we give it "a bit" more time to be safe
		});

		await expect
			.element(screen.getByTestId('attribution-hover-card'))
			.toBeInTheDocument();
	});

	test('should render the attributions', async () => {
		const attributions = [
			{
				type: 'custom-attr-type',
				text: 'Attribution 1',
				link: 'https://example.com/1',
			},
			{
				type: 'custom-attr-type',
				text: 'Attribution 2',
				link: 'https://example.com/2',
			},
		];

		const screen = await renderWithRouter(
			<Attribution attributions={attributions} delay={0} />,
		);

		await screen.getByTestId('attribution-hover-trigger').hover({
			timeout: 100,
		});

		const card = screen.getByTestId('attribution-hover-card');
		expect(card).toBeInTheDocument();

		for (const attr of attributions) {
			const el = screen.getByText(attr.text);
			expect(el).toBeInTheDocument();
		}
	});

	test('should close the hover card when the mouse leaves the trigger', async () => {
		const screen = await renderWithRouter(
			<Attribution attributions={[]} delay={0} />,
		);

		await screen.getByTestId('attribution-hover-trigger').hover({
			timeout: 100,
		});

		await expect
			.element(screen.getByTestId('attribution-hover-card'))
			.toBeInTheDocument();

		await screen.getByTestId('attribution-hover-trigger').unhover({
			timeout: 100,
		});

		await expect
			.element(screen.getByTestId('attribution-hover-card'))
			.not.toBeInTheDocument();
	});
});
