import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

type ItemProps = {
  href: string;
  text: string;
};

function Item({ href, text }: ItemProps) {
  return (
    <Button asChild variant="link" className="px-0">
      <Link to={href}>{text}</Link>
    </Button>
  );
}

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold">Amenities</h3>
          <ul className="list-disc list-inside">
            <li>
              <Item href="/dashboard/amenities" text="View" />
            </li>
            <li>
              <Item href="/dashboard/amenities/new" text="New" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold">Categories</h3>
          <ul className="list-disc list-inside">
            <li>
              <Item href="/dashboard/categories" text="View" />
            </li>
            <li>
              <Item href="/dashboard/categories/new" text="New" />
            </li>
          </ul>
        </div>

        <Separator className="col-span-full" />

        <div>
          <h3 className="text-lg font-bold">Cities</h3>
          <ul className="list-disc list-inside">
            <li>
              <Item href="/dashboard/cities" text="View" />
            </li>
            <li>
              <Item href="/dashboard/cities/new" text="New" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold">Point of Interests</h3>
          <ul className="list-disc list-inside">
            <li>
              <Item href="/dashboard/pois" text="View" />
            </li>
            <li>
              <Item href="/dashboard/pois/drafts" text="Drafts" />
            </li>
          </ul>
        </div>

        <Separator className="col-span-full" />

        <div>
          <h3 className="text-lg font-bold">Users</h3>
          <ul className="list-disc list-inside">
            <li>
              <Item href="/dashboard/users" text="View" />
            </li>
            <li>
              <Item href="/dashboard/users/verify" text="Make User Verified" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold">Collections</h3>
          <ul className="list-disc list-inside">
            <li>
              <Item href="/dashboard/collections" text="View" />
            </li>
            <li>
              <Item href="/dashboard/collections/new" text="New" />
            </li>
            <li>
              <Item
                href="/dashboard/collections/relations/city"
                text="City Relations"
              />
            </li>
            <li>
              <Item
                href="/dashboard/collections/relations/poi"
                text="Point of Interest Relations"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
