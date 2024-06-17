import { Props as NavItemProps } from './item';

import {
  BeefIcon,
  BeerIcon,
  CakeSliceIcon,
  CameraIcon,
  CoffeeIcon,
  FlameIcon,
  LandmarkIcon,
  LeafIcon,
  MountainIcon,
  Music2Icon,
  PaletteIcon,
  PartyPopperIcon,
  SaladIcon,
  TentIcon,
  WineIcon,
} from 'lucide-react';

const base = 'search?locations[refinementList][tags][0]=';

const data = [
  { href: `${base}Trending`, text: 'Trending', icon: FlameIcon },
  // { href: `${base}Family Friendly`, text: 'Family Friendly', icon: BabyIcon },
  { href: `${base}Coffee`, text: 'Coffee', icon: CoffeeIcon },
  { href: `${base}Bar`, text: 'Bars', icon: BeerIcon },
  { href: `${base}Landmark`, text: 'Landmarks', icon: LandmarkIcon },
  { href: `${base}Trekking`, text: 'Trekking', icon: MountainIcon },
  { href: `${base}Art`, text: 'Art', icon: PaletteIcon },
  { href: `${base}Party`, text: 'Parties', icon: PartyPopperIcon },
  { href: `${base}Vegan`, text: 'Vegan', icon: SaladIcon },
  { href: `${base}Camping`, text: 'Camping', icon: TentIcon },
  { href: `${base}Music`, text: 'Music', icon: Music2Icon },
  // { href: `${base}Fine Dining`, text: 'Fine Dining', icon: UtensilsIcon },
  // { href: `${base}City Night`, text: 'City Night', icon: MoonIcon },
  { href: `${base}Steakhouse`, text: 'Steakhouse', icon: BeefIcon },
  { href: `${base}Pattisery`, text: 'Pattiseries', icon: CakeSliceIcon },
  // { href: `${base}Street Food`, text: 'Street Food', icon: DrumstickIcon },
  { href: `${base}Yoga`, text: 'Yoga', icon: LeafIcon },
  // { href: `${base}Cocktail Bar`, text: 'Cocktail Bars', icon: MartiniIcon },
  { href: `${base}Wine`, text: 'Wine', icon: WineIcon },
  // { href: `${base}Movie Theater`, text: 'Movie Theaters', icon: PopcornIcon },
  { href: `${base}Photography`, text: 'Photography', icon: CameraIcon },
  // { href: `${base}Budget`, text: 'On a Budget', icon: DollarSignIcon },
] satisfies NavItemProps[];

export default data;
