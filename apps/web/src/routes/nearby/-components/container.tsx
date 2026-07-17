import { Button } from '@wanderlust/ui/components/button';
import { Separator } from '@wanderlust/ui/components/separator';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@wanderlust/ui/components/sheet';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { useState } from 'react';
import { useGeoSearch } from 'react-instantsearch';
import MapContainer, {
	FullscreenControl,
	GeolocateControl,
	NavigationControl,
} from 'react-map-gl/maplibre';
import { useMapStyle } from '@/hooks/use-map-style';
import { useIsMobile } from '@/hooks/use-mobile';
import { RefinementList } from '@/routes/search/$type/-places/refinement-list';
import { ErrorComponent } from './error';
import { GeoSearch } from './geo-search';
import { Loading } from './loading';
import { useGeolocationPermission } from './use-geolocation-permission';

export function Container() {
	const { items } = useGeoSearch();
	const query = useGeolocationPermission();
	const isMobile = useIsMobile();
	const style = useMapStyle();
	const [open, setOpen] = useState(true);

	if (query.isLoading) {
		return <Loading />;
	}

	if (query.error) {
		return (
			<ErrorComponent
				message={query.error.message}
				refetch={() => query.refetch()}
			/>
		);
	}

	return (
		<div className="relative flex min-h-0 flex-1 flex-col items-stretch md:flex-row">
			<Sheet open={open} onOpenChange={setOpen} modal={false}>
				<SheetTrigger className="absolute top-6 left-4 z-50">
					<Button>
						{open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
						<span>{open ? 'Close' : 'Open'}</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="top-1/2 left-8 h-3/4 -translate-y-1/2 rounded-md"
				>
					<SheetHeader>
						<SheetTitle>Explore Places</SheetTitle>
						<SheetDescription>Filters</SheetDescription>
					</SheetHeader>
					<div className="overflow-y-auto px-4">
						<RefinementList attribute="place.primaryCategory.id" />

						<RefinementList attribute="place.amenities" />

						<RefinementList attribute="place.priceLevel" />

						<RefinementList attribute="place.accessibilityLevel" />
					</div>
					<SheetFooter>
						<Separator />
						<div className="text-muted-foreground text-sm">
							Listing {items.length} places
						</div>
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<MapContainer
				reuseMaps
				initialViewState={{
					longitude: query.data?.[1],
					latitude: query.data?.[0],
					zoom: isMobile ? 12 : 14,
					pitch: 0,
					bearing: 0,
				}}
				mapStyle={style}
				minZoom={10}
				style={{
					height: 'calc(100dvh - 4.5rem - 4rem)',
					marginTop: '8px',
					zIndex: 0,
				}}
			>
				<GeolocateControl position="top-right" />
				<FullscreenControl position="top-right" />
				<NavigationControl position="top-right" />

				<GeoSearch />
			</MapContainer>
		</div>
	);
}
