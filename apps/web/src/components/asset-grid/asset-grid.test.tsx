import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/test/render-with-router';
import { AssetGrid } from '.';
import type { Props } from './types';

describe('Components/AssetGrid', () => {
	test('empty assets array should render null', async () => {
		const props: Props = {
			assets: [],
		};

		const screen = await renderWithRouter(<AssetGrid {...props} />);
		expect(screen.getByTestId('asset-grid')).not.toBeInTheDocument();
	});
});
