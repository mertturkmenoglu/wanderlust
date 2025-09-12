import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
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
} from "lucide-react-native";
import { FlatList, Pressable, Text } from "react-native";

const data = [
  { href: `Hotels`, text: "Hotels", icon: BedIcon },
  { href: `Coffee shops`, text: "Coffee", icon: CoffeeIcon },
  { href: `Bars & Clubs`, text: "Bars", icon: MartiniIcon },
  { href: `Breweries`, text: "Breweries", icon: BeerIcon },
  { href: `Museums`, text: "Museums", icon: LandmarkIcon },
  { href: `Photography spots`, text: "Photography", icon: CameraIcon },
  { href: `Restaurants`, text: "Restaurants", icon: UtensilsIcon },
  {
    href: `Tourist Attractions`,
    text: "Attractions",
    icon: MapPinnedIcon,
  },
  {
    href: `Coworking spaces`,
    text: "Work Spaces",
    icon: GraduationCapIcon,
  },
  {
    href: `Bookstores`,
    text: "Bookstores",
    icon: LibraryIcon,
  },
  {
    href: `Natural landmarks`,
    text: "Landmarks",
    icon: MountainSnowIcon,
  },
] satisfies NavItemProps[];

type NavItemProps = {
  href: string;
  text: string;
  icon: LucideIcon;
};

function NavItem({ href, text, icon: Icon }: NavItemProps): React.ReactElement {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/(app)/search",
          params: {},
        });
      }}
      className={cn("flex flex-col items-center p-2")}
    >
      <Icon
        color={Colors.light.primary}
        className="size-6 group-hover:text-primary"
      />
      <Text className="mt-1 line-clamp-1 text-center text-zinc-500">
        {text}
      </Text>
    </Pressable>
  );
}

type Props = {
  className?: string;
};

export function TagNavigation({ className }: Props) {
  return (
    <FlatList
      className={cn("", className)}
      contentContainerClassName="gap-21"
      data={data}
      renderItem={({ item }) => <NavItem {...item} />}
      horizontal={true}
      keyExtractor={(item) => item.href}
    />
  );
}
