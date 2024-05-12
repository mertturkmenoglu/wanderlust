import CategoryNavIcon from "@/components/blocks/CategoryNavIcon";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  BabyIcon,
  BeefIcon,
  BeerIcon,
  CakeSliceIcon,
  CameraIcon,
  CoffeeIcon,
  DollarSignIcon,
  DrumstickIcon,
  FlameIcon,
  LandmarkIcon,
  LeafIcon,
  MartiniIcon,
  MoonIcon,
  MountainIcon,
  Music2Icon,
  PaletteIcon,
  PartyPopperIcon,
  PopcornIcon,
  SaladIcon,
  TentIcon,
  UtensilsIcon,
  WineIcon,
} from "lucide-react";

export default function Home() {
  return (
    <main className="">
      <nav className="mx-auto flex justify-center my-12 items-center space-x-4">
        <input
          className="border border-black/30 w-1/2 py-4 rounded-full px-8"
          placeholder="Search a location or an event"
        />

        <Button size="icon" className="rounded-full size-12">
          <MagnifyingGlassIcon className="size-6" />
        </Button>
      </nav>

      <ul className="my-12 flex items-center justify-center space-x-4">
        <CategoryNavIcon href="#" text="Trending" icon={FlameIcon} />
        <CategoryNavIcon href="#" text="Family Friendly" icon={BabyIcon} />
        <CategoryNavIcon href="#" text="Coffee" icon={CoffeeIcon} />
        <CategoryNavIcon href="#" text="Bars" icon={BeerIcon} />
        <CategoryNavIcon href="#" text="Landmarks" icon={LandmarkIcon} />
        <CategoryNavIcon href="#" text="Trekking" icon={MountainIcon} />
        <CategoryNavIcon href="#" text="Art" icon={PaletteIcon} />
        <CategoryNavIcon href="#" text="Parties" icon={PartyPopperIcon} />
        <CategoryNavIcon href="#" text="Vegan" icon={SaladIcon} />
        <CategoryNavIcon href="#" text="Camping" icon={TentIcon} />
        <CategoryNavIcon href="#" text="Music" icon={Music2Icon} />
        <CategoryNavIcon href="#" text="Fine Dining" icon={UtensilsIcon} />
        <CategoryNavIcon href="#" text="City Night" icon={MoonIcon} />
        <CategoryNavIcon href="#" text="Steakhouse" icon={BeefIcon} />
        <CategoryNavIcon href="#" text="Pattiseries" icon={CakeSliceIcon} />
        <CategoryNavIcon href="#" text="Street Food" icon={DrumstickIcon} />
        <CategoryNavIcon href="#" text="Yoga" icon={LeafIcon} />
        <CategoryNavIcon href="#" text="Cocktail Bars" icon={MartiniIcon} />
        <CategoryNavIcon href="#" text="Wine" icon={WineIcon} />
        <CategoryNavIcon href="#" text="Movie Theaters" icon={PopcornIcon} />
        <CategoryNavIcon href="#" text="Photography" icon={CameraIcon} />
        <CategoryNavIcon href="#" text="On a Budget" icon={DollarSignIcon} />
      </ul>

      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tighter lg:text-3xl text-accent-foreground">
        Discover What&apos;s Around you
      </h2>
    </main>
  );
}
