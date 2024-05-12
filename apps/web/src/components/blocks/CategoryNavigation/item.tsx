import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

export type Props = {
  href: string;
  text: string;
  icon: LucideIcon;
};

function NavItem(props: Props): React.ReactElement {
  return (
    <li>
      <Link
        href={props.href}
        className={cn(
          "flex flex-col items-center p-1",
          "transition-all duration-200",
          "border-b-2 border-b-transparent group hover:border-b-primary",
          "text-muted-foreground"
        )}
      >
        <props.icon className="size-6 group-hover:text-primary" />
        <span className="group-hover:text-primary line-clamp-1 text-center mt-1">
          {props.text}
        </span>
      </Link>
    </li>
  );
}

export default NavItem;
