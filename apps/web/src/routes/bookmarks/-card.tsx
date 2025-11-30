import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ipx } from '@/lib/ipx';
import type { TBookmark } from './-types';

type Props = {
	bookmark: TBookmark;
};

export function BookmarkCard({ bookmark: { place } }: Props) {
	return (
		<Card className="group flex flex-col py-0 md:flex-row">
			<img
				src={ipx(place.assets[0]?.url ?? '', 'w_512')}
				alt={place.assets[0]?.description ?? ''}
				className="aspect-video w-full rounded-t-md object-cover md:w-32 md:rounded-none md:rounded-l-md lg:w-32 2xl:w-64"
			/>

			<div className="w-full py-6">
				<CardHeader className="w-full">
					<CardTitle className="line-clamp-1 capitalize" title={place.name}>
						{place.name}
					</CardTitle>
					<CardDescription className="line-clamp-1">
						{place.address.city.name} / {place.address.city.countryName}
					</CardDescription>
				</CardHeader>

				<CardContent className="mt-4">
					<p className="line-clamp-1 text-primary text-sm leading-none">
						{place.category.name}
					</p>
				</CardContent>
			</div>
		</Card>
	);
}
