
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import data from "./data";
import NavItem from "./item";

export default function TagNavigation(): React.ReactElement {
  return (
    <ScrollArea>
      <ul className="flex items-center justify-center space-x-4">
        {data.map((item) => (
          <NavItem {...item} key={item.href} />
        ))}
      </ul>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
