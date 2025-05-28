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

const iconMapping: Map<number, LucideIconType> = new Map([
  [1, WifiIcon],
  [2, SquareParkingIcon],
  [3, ParkingMeterIcon],
  [4, AccessibilityIcon],
  [5, ToiletIcon],
  [6, WindIcon],
  [7, RockingChairIcon],
  [8, ArmchairIcon],
  [9, MartiniIcon],
  [10, PawPrintIcon],
  [11, BlocksIcon],
  [12, CarFrontIcon],
  [13, HandCoinsIcon],
  [14, CalendarCheckIcon],
  [15, PackageIcon],
  [16, VeganIcon],
  [17, MicVocalIcon],
  [18, LockIcon],
  [19, GlobeIcon],
  [20, PlugZapIcon],
  [21, HandPlatterIcon],
  [22, CigaretteIcon],
  [23, RouteIcon],
  [24, GiftIcon],
  [25, DonutIcon],
  [26, InfoIcon],
  [27, GemIcon],
  [28, TelescopeIcon],
  [29, CircleDollarSignIcon],
  [30, CameraIcon],
  [31, PersonStandingIcon],
  [32, GraduationCapIcon],
  [33, HeartIcon],
  [34, UsersIcon],
  [35, ConciergeBellIcon],
  [36, DumbbellIcon],
  [37, DropletsIcon],
  [38, BriefcaseBusinessIcon],
  [39, UsersIcon],
  [40, LeafIcon],
  [41, BusIcon],
  [42, FenceIcon],
  [43, HandPlatterIcon],
  [44, Gamepad2Icon],
  [45, GlobeIcon],
  [46, TicketIcon],
  [47, UtensilsIcon],
  [48, WheatOffIcon],
  [49, SquareMenuIcon],
  [50, WineIcon],
  [51, CookingPotIcon],
  [52, CupSodaIcon],
  [53, ChefHatIcon],
  [54, Columns2Icon],
  [55, EggIcon],
  [56, PartyPopperIcon],
]);

type Props = {
  className?: string;
};

export default function Amenities({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const { amenities } = poi;
  const isEmpty = amenities.length === 0;

  return (
    <div className={cn(className)}>
      <h3 className="text-xl font-semibold tracking-tight">Amenities</h3>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {isEmpty ? (
          <EmptyState />
        ) : (
          amenities.map(({ id, name }) => (
            <Item
              key={id}
              id={id}
              name={name}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Item({ id, name }: { id: number; name: string }) {
  const Icon = iconMapping.get(id) ?? CheckIcon;

  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 min-h-4 min-w-4 text-primary" />
      <Link
        to="/search"
        search={{
          'pois[refinementList][poi.amenities.name][0]': name,
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
