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
  { href: `${base}trending`, text: 'Trending', icon: FlameIcon },
  // { href: `${base}Family Friendly`, text: 'Family Friendly', icon: BabyIcon },
  { href: `${base}coffee`, text: 'Coffee', icon: CoffeeIcon },
  { href: `${base}bar`, text: 'Bars', icon: BeerIcon },
  { href: `${base}landmark`, text: 'Landmarks', icon: LandmarkIcon },
  { href: `${base}trekking`, text: 'Trekking', icon: MountainIcon },
  { href: `${base}art`, text: 'Art', icon: PaletteIcon },
  { href: `${base}party`, text: 'Parties', icon: PartyPopperIcon },
  { href: `${base}vegan`, text: 'Vegan', icon: SaladIcon },
  { href: `${base}camping`, text: 'Camping', icon: TentIcon },
  { href: `${base}music`, text: 'Music', icon: Music2Icon },
  // { href: `${base}Fine Dining`, text: 'Fine Dining', icon: UtensilsIcon },
  // { href: `${base}City Night`, text: 'City Night', icon: MoonIcon },
  { href: `${base}steakhouse`, text: 'Steakhouse', icon: BeefIcon },
  { href: `${base}pattisery`, text: 'Pattiseries', icon: CakeSliceIcon },
  // { href: `${base}Street Food`, text: 'Street Food', icon: DrumstickIcon },
  { href: `${base}yoga`, text: 'Yoga', icon: LeafIcon },
  // { href: `${base}Cocktail Bar`, text: 'Cocktail Bars', icon: MartiniIcon },
  { href: `${base}wine`, text: 'Wine', icon: WineIcon },
  // { href: `${base}Movie Theater`, text: 'Movie Theaters', icon: PopcornIcon },
  { href: `${base}photography`, text: 'Photography', icon: CameraIcon },
  // { href: `${base}Budget`, text: 'On a Budget', icon: DollarSignIcon },
] satisfies NavItemProps[];

export default data;
