import { Link } from "@remix-run/react";
import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export type Props = {
  href: string;
  text: string;
  icon: LucideIcon;
};

export default function NavItem(props: Props): React.ReactElement {
  return (
    <li>
      <Link
        to={encodeURI(props.href)}
        className={cn(
          "flex flex-col items-center p-1",
          "transition-all duration-200",
          "group border-b-2 border-b-transparent hover:border-b-primary",
          "text-muted-foreground"
        )}
      >
        <props.icon className="size-6 group-hover:text-primary" />
        <span className="mt-1 line-clamp-1 text-center group-hover:text-primary">
          {props.text}
        </span>
      </Link>
    </li>
  );
}
