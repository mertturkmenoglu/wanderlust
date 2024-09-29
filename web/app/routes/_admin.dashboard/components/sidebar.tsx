import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
};

export default function Sidebar({ className }: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      <ul className="flex flex-col">
        <Item href="/dashboard" text="Dashboard" />

        <Collapsible>
          <Trigger text="Amenities" />
          <CollapsibleContent>
            <ul className="ml-4">
              <Item href="/dashboard/amenities" text="View" />
              <Item href="/dashboard/amenities/new" text="New" />
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <Trigger text="Categories" />
          <CollapsibleContent>
            <ul className="ml-4">
              <Item href="/dashboard/categories" text="View" />
              <Item href="/dashboard/categories/new" text="New" />
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <Trigger text="Cities" />
          <CollapsibleContent>
            <ul className="ml-4">
              <Item href="/dashboard/cities" text="View" />
              <Item href="/dashboard/cities/new" text="New" />
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <Trigger text="Point of Interests" />
          <CollapsibleContent>
            <ul className="ml-4">
              <Item href="/dashboard/pois" text="View" />
              <Item href="/dashboard/pois/drafts" text="Drafts" />
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <Trigger text="Users" />
          <CollapsibleContent>
            <ul className="ml-4">
              <Item href="/dashboard/users" text="View" />
              <Item href="/dashboard/users/verify" text="Make User Verified" />
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <Trigger text="Reports" />
          <CollapsibleContent>
            <ul className="ml-4"></ul>
          </CollapsibleContent>
        </Collapsible>
      </ul>
    </div>
  );
}

type ItemProps = {
  href: string;
  text: string;
};

function Item({ href, text }: ItemProps) {
  return (
    <li>
      <Button asChild variant="link" className="px-0">
        <Link to={href}>{text}</Link>
      </Button>
    </li>
  );
}

type TriggerProps = {
  text: string;
};

function Trigger({ text }: TriggerProps) {
  return (
    <CollapsibleTrigger asChild>
      <Button variant="link" className="px-0">
        {text}
      </Button>
    </CollapsibleTrigger>
  );
}
