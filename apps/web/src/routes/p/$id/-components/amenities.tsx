import { getRouteApi, Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	AccessibilityIcon,
	ArmchairIcon,
	BlocksIcon,
	BriefcaseBusinessIcon,
	BusIcon,
	CalendarCheckIcon,
	CameraIcon,
	CarFrontIcon,
	CheckIcon,
	ChefHatIcon,
	CigaretteIcon,
	CircleDollarSignIcon,
	Columns2Icon,
	ConciergeBellIcon,
	CookingPotIcon,
	CupSodaIcon,
	DonutIcon,
	DropletsIcon,
	DumbbellIcon,
	EggIcon,
	FenceIcon,
	Gamepad2Icon,
	GemIcon,
	GiftIcon,
	GlobeIcon,
	GraduationCapIcon,
	HandCoinsIcon,
	HandPlatterIcon,
	HeartIcon,
	InfoIcon,
	LeafIcon,
	LockIcon,
	MartiniIcon,
	MicVocalIcon,
	PackageIcon,
	ParkingMeterIcon,
	PartyPopperIcon,
	PawPrintIcon,
	PersonStandingIcon,
	PlugZapIcon,
	RockingChairIcon,
	RouteIcon,
	SquareMenuIcon,
	SquareParkingIcon,
	TelescopeIcon,
	TicketIcon,
	ToiletIcon,
	UsersIcon,
	UtensilsIcon,
	VeganIcon,
	WheatOffIcon,
	WifiIcon,
	WindIcon,
	WineIcon,
} from 'lucide-react';
import { amenitiesDisplayNames } from '@/lib/amenities';

type LucideIconType = typeof WifiIcon;

const iconMapping = new Map<string, LucideIconType>([
	['wifi', WifiIcon],
	['freeParking', SquareParkingIcon],
	['paidParking', ParkingMeterIcon],
	['wheelchair', AccessibilityIcon],
	['restrooms', ToiletIcon],
	['ac', WindIcon],
	['outdoor', RockingChairIcon],
	['indoor', ArmchairIcon],
	['bar', MartiniIcon],
	['pet', PawPrintIcon],
	['kidsPlay', BlocksIcon],
	['driveThru', CarFrontIcon],
	['loyalty', HandCoinsIcon],
	['allWeekService', CalendarCheckIcon],
	['delivery', PackageIcon],
	['vegan', VeganIcon],
	['liveMusic', MicVocalIcon],
	['privateRooms', LockIcon],
	['onlineOrdering', GlobeIcon],
	['evCharging', PlugZapIcon],
	['selfService', HandPlatterIcon],
	['smoking', CigaretteIcon],
	['guidedTours', RouteIcon],
	['giftShop', GiftIcon],
	['snackBar', DonutIcon],
	['informationDesk', InfoIcon],
	['specialExhibitions', GemIcon],
	['observationDecks', TelescopeIcon],
	['atm', CircleDollarSignIcon],
	['photographyArea', CameraIcon],
	['a11yServices', PersonStandingIcon],
	['studyRoom', GraduationCapIcon],
	['romanticAtmosphere', HeartIcon],
	['familyFriendly', UsersIcon],
	['concierge', ConciergeBellIcon],
	['fitness', DumbbellIcon],
	['spa', DropletsIcon],
	['workspaces', BriefcaseBusinessIcon],
	['groupActivities', UsersIcon],
	['ecoFriendly', LeafIcon],
	['publicTransportation', BusIcon],
	['garden', FenceIcon],
	['complimentaryTasting', HandPlatterIcon],
	['gamingStations', Gamepad2Icon],
	['onlineReservation', GlobeIcon],
	['valetParking', TicketIcon],
	['catering', UtensilsIcon],
	['specialDietaryOptions', WheatOffIcon],
	['childrensMenu', SquareMenuIcon],
	['wineList', WineIcon],
	['liveCookingStations', CookingPotIcon],
	['happyHourSpecials', CupSodaIcon],
	['chefsSpecials', ChefHatIcon],
	['communalTables', Columns2Icon],
	['brunchOptions', EggIcon],
	['eventHosting', PartyPopperIcon],
]);

type Props = {
	className?: string;
};

export function Amenities({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const { amenities } = place;
	const isEmpty = amenities.length === 0;

	return (
		<div className={cn(className)}>
			<h3 className="font-semibold text-xl tracking-tight">Amenities</h3>
			<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{isEmpty ? (
					<EmptyState />
				) : (
					amenities.map((amenity) => <Item key={amenity} id={amenity} />)
				)}
			</div>
		</div>
	);
}

function Item({ id }: { id: string }) {
	const Icon = iconMapping.get(id) ?? CheckIcon;
	const displayName = amenitiesDisplayNames.get(id) ?? id;

	return (
		<div className="group flex items-center gap-2">
			<Icon className="size-6 min-h-6 min-w-6 text-muted-foreground group-hover:text-primary" />
			<Link
				to="/search"
				search={{
					amenity: id,
				}}
				className="line-clamp-2 text-muted-foreground text-sm group-hover:text-primary md:text-base"
			>
				{displayName}
			</Link>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="col-span-full">
			<div className="text-muted-foreground text-sm">
				There are no amenities available for this location.
			</div>
		</div>
	);
}
