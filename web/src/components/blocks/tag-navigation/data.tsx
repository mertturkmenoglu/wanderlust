import { type Props as NavItemProps } from './item';

import {
  BedIcon,
  BeerIcon,
  CameraIcon,
  CoffeeIcon,
  GraduationCapIcon,
  LandmarkIcon,
  LibraryIcon,
  MapPinnedIcon,
  MartiniIcon,
  MountainSnowIcon,
  UtensilsIcon,
} from 'lucide-react';

const base = 'search?pois[refinementList][poi.Category.Name][0]=';

const data = [
  { href: `${base}Hotels`, text: 'Hotels', icon: BedIcon },
  { href: `${base}Coffee shops`, text: 'Coffee', icon: CoffeeIcon },
  { href: `${base}Bars & Clubs`, text: 'Bars', icon: MartiniIcon },
  { href: `${base}Breweries`, text: 'Breweries', icon: BeerIcon },
  { href: `${base}Museums`, text: 'Museums', icon: LandmarkIcon },
  { href: `${base}Photography spots`, text: 'Photography', icon: CameraIcon },
  { href: `${base}Restaurants`, text: 'Restaurants', icon: UtensilsIcon },
  {
    href: `${base}Tourist Attractions`,
    text: 'Attractions',
    icon: MapPinnedIcon,
  },
  {
    href: `${base}Coworking spaces`,
    text: 'Work Spaces',
    icon: GraduationCapIcon,
  },
  {
    href: `${base}Bookstores`,
    text: 'Bookstores',
    icon: LibraryIcon,
  },
  {
    href: `${base}Natural landmarks`,
    text: 'Landmarks',
    icon: MountainSnowIcon,
  },
] satisfies NavItemProps[];

export default data;
