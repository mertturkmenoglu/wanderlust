import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
      <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Item href="/dashboard/amenities" text="View" />
            <Item href="/dashboard/amenities/new" text="New" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Item href="/dashboard/categories" text="View" />
            <Item href="/dashboard/categories/new" text="New" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cities</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Item href="/dashboard/cities" text="View" />
            <Item href="/dashboard/cities/new" text="New" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Point of Interests</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Item href="/dashboard/pois" text="View" />
            <Item href="/dashboard/pois/drafts" text="Drafts" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Item href="/dashboard/users" text="View" />
            <Item href="/dashboard/users/verify" text="Make User Verified" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <Item href="/dashboard/collections" text="View" />
            <Item href="/dashboard/collections/new" text="New" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-2"></CardContent>
        </Card>
      </div>
    </div>
  );
}
