/** biome-ignore-all lint/a11y/noSvgWithoutTitle: TODO */
import type { SVGProps } from 'react';

export function Pin({
	width = 40,
	height = 40,
	...props
}: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			fill="#18815e"
			stroke="#f0fdf4"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			className="lucide lucide-map-pin-icon lucide-map-pin"
			viewBox="0 0 24 24"
			{...props}
		>
			<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
			<circle cx={12} cy={10} r={3} />
		</svg>
	);
}
