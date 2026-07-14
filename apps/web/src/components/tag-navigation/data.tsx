import {
	BedIcon,
	BeerIcon,
	CoffeeIcon,
	LandmarkIcon,
	LibraryIcon,
	MapPinnedIcon,
	MartiniIcon,
	MountainSnowIcon,
	ParasolIcon,
	UtensilsIcon,
} from 'lucide-react';
import type { Props as NavItemProps } from './item';

export const data = [
	{
		category: 'accommodation-hotel',
		text: 'Hotels',
		icon: BedIcon,
	},
	{
		category: 'food-and-drink-cafe',
		text: 'Cafés',
		icon: CoffeeIcon,
	},
	{
		category: 'food-and-drink-restaurant',
		text: 'Restaurants',
		icon: UtensilsIcon,
	},
	{
		category: 'food-and-drink-bar',
		text: 'Bars',
		icon: MartiniIcon,
	},
	{
		category: 'food-and-drink-brewery',
		text: 'Breweries',
		icon: BeerIcon,
	},
	{
		category: 'entertainment-museum',
		text: 'Museums',
		icon: LandmarkIcon,
	},
	{
		category: 'nature-beach',
		text: 'Beaches',
		icon: ParasolIcon,
	},

	{
		category: 'tourism',
		text: 'Attractions',
		icon: MapPinnedIcon,
	},
	{
		category: 'commercial-bookstore',
		text: 'Bookstores',
		icon: LibraryIcon,
	},
	{
		category: 'nature-national-park',
		text: 'Nature',
		icon: MountainSnowIcon,
	},
] satisfies NavItemProps[];
