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
import type { Props as NavItemProps } from './item';

export const data = [
	{
		category: 'Hotels',
		text: 'Hotels',
		icon: BedIcon,
	},
	{
		category: 'Coffee shops',
		text: 'Coffee',
		icon: CoffeeIcon,
	},
	{
		category: 'Bars & Clubs',
		text: 'Bars',
		icon: MartiniIcon,
	},
	{
		category: 'Breweries',
		text: 'Breweries',
		icon: BeerIcon,
	},
	{
		category: 'Museums',
		text: 'Museums',
		icon: LandmarkIcon,
	},
	{
		category: 'Photography spots',
		text: 'Photography',
		icon: CameraIcon,
	},
	{
		category: 'Restaurants',
		text: 'Restaurants',
		icon: UtensilsIcon,
	},
	{
		category: 'Tourist Attractions',
		text: 'Attractions',
		icon: MapPinnedIcon,
	},
	{
		category: 'Coworking spaces',
		text: 'Work Spaces',
		icon: GraduationCapIcon,
	},
	{
		category: 'Bookstores',
		text: 'Bookstores',
		icon: LibraryIcon,
	},
	{
		category: 'Natural landmarks',
		text: 'Landmarks',
		icon: MountainSnowIcon,
	},
] satisfies NavItemProps[];
