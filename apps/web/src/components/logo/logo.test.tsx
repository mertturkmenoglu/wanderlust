import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Logo } from '.';

describe('Components/Logo', () => {
	test('render without props', async () => {
		const screen = await render(<Logo />);
		const component = screen.getByTestId('logo');
		expect(component).toBeInTheDocument();
	});

	test('render with variant prop', async () => {
		const screen = await render(<Logo variant="large" />);
		const component = screen.getByTestId('logo');
		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('size-48 min-h-48 min-w-48');
	});

	test('render with grayscale prop', async () => {
		const screen = await render(<Logo grayscale />);
		const component = screen.getByTestId('logo');
		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('grayscale');
	});

	test('render with className prop', async () => {
		const screen = await render(<Logo className="custom-class" />);
		const component = screen.getByTestId('logo');
		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('custom-class');
	});
});
