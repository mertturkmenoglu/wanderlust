import { cn } from '@wanderlust/ui/lib/utils';
import React from 'react';

type Span = 1 | 2 | 3 | 4;
type RowSpan = 1 | 2;

export type BentoSectionConfig = {
	content: React.ReactNode;
	colSpan?: Span;
	rowSpan?: RowSpan;
	className?: string;
	key?: string | number;
};

export type BentoSection = React.ReactNode | BentoSectionConfig;

export type BentoGridProps = {
	sections: BentoSection[];
	columns?: 2 | 3 | 4 | 5 | 6;
	gap?: 2 | 3 | 4 | 5 | 6 | 8;
	minRowHeight?: string;
	dense?: boolean;
	pattern?: Array<Pick<BentoSectionConfig, 'colSpan' | 'rowSpan'>>;
	classNames?: Partial<{
		root: string;
		cell: string;
	}>;
};

type SpanPair = Pick<BentoSectionConfig, 'colSpan' | 'rowSpan'>;

const PRESETS: Record<number, SpanPair[]> = {
	1: [{ colSpan: 4, rowSpan: 2 }],
	2: [
		{ colSpan: 2, rowSpan: 2 },
		{ colSpan: 2, rowSpan: 2 },
	],
	3: [
		{ colSpan: 2, rowSpan: 2 },
		{ colSpan: 2, rowSpan: 1 },
		{ colSpan: 2, rowSpan: 1 },
	],
	4: [
		{ colSpan: 2, rowSpan: 2 },
		{ colSpan: 1, rowSpan: 1 },
		{ colSpan: 1, rowSpan: 1 },
		{ colSpan: 2, rowSpan: 1 },
	],
};

const CYCLE_PATTERN: SpanPair[] = [
	{ colSpan: 2, rowSpan: 2 },
	{ colSpan: 1, rowSpan: 1 },
	{ colSpan: 1, rowSpan: 1 },
	{ colSpan: 2, rowSpan: 1 },
	{ colSpan: 1, rowSpan: 2 },
	{ colSpan: 1, rowSpan: 1 },
];

const COL_SPAN: Record<Span, string> = {
	1: 'col-span-1',
	2: 'col-span-2',
	3: 'col-span-3',
	4: 'col-span-4',
};

const ROW_SPAN: Record<RowSpan, string> = {
	1: 'row-span-1',
	2: 'row-span-2',
};

const GRID_COLS: Record<number, string> = {
	2: 'lg:grid-cols-2',
	3: 'lg:grid-cols-3',
	4: 'lg:grid-cols-4',
	5: 'lg:grid-cols-5',
	6: 'lg:grid-cols-6',
};

const GAP: Record<number, string> = {
	2: 'gap-2',
	3: 'gap-3',
	4: 'gap-4',
	5: 'gap-5',
	6: 'gap-6',
	8: 'gap-8',
};

function isConfig(section: BentoSection): section is BentoSectionConfig {
	return (
		typeof section === 'object' &&
		section !== null &&
		!React.isValidElement(section) &&
		'content' in section
	);
}

export function BentoGrid({
	sections,
	columns = 4,
	gap = 2,
	minRowHeight = '10rem',
	dense = true,
	pattern,
	classNames,
}: BentoGridProps) {
	const activePattern = pattern ?? PRESETS[sections.length] ?? CYCLE_PATTERN;

	return (
		<div
			className={cn(
				'grid w-full grid-cols-2 sm:grid-cols-3',
				GRID_COLS[columns],
				GAP[gap],
				{
					'grid-flow-row-dense': dense,
				},
				classNames?.root,
			)}
			style={{ gridAutoRows: minRowHeight }}
		>
			{sections.map((section, i) => {
				const config: BentoSectionConfig = isConfig(section)
					? section
					: { content: section };

				const fallback = activePattern[i % activePattern.length] ?? {};
				const colSpan = (config.colSpan ?? fallback.colSpan ?? 1) as Span;
				const rowSpan = (config.rowSpan ?? fallback.rowSpan ?? 1) as RowSpan;

				return (
					<div
						key={config.key ?? i}
						className={cn(
							COL_SPAN[colSpan],
							ROW_SPAN[rowSpan],
							'rounded-2xl bg-white',
							classNames?.cell,
							config.className,
						)}
					>
						{config.content}
					</div>
				);
			})}
		</div>
	);
}

export default BentoGrid;
