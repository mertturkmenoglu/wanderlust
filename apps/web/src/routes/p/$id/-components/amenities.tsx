import { cn } from '@/lib/utils';
import { getRouteApi, Link } from '@tanstack/react-router';
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
  const isEmpty = Object.keys(amenities).length === 0;

  return (
    <div className={cn(className)}>
      <h3 className="text-xl font-semibold tracking-tight">Amenities</h3>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {isEmpty ? (
          <EmptyState />
        ) : (
          Object.keys(amenities).map((key) => (
            <Item
              key={key}
              id={key}
              name={amenities[key] ?? ''}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Item({ id, name }: { id: string; name: string }) {
  const Icon = iconMapping.get(id) ?? CheckIcon;

  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 min-h-4 min-w-4 text-primary" />
      <Link
        to="/search"
        search={{
          amenity: name,
        }}
        className="text-muted-foreground text-sm line-clamp-2 hover:text-primary hover:underline"
      >
        {name}
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
