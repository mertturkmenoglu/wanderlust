import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/')({
  component: RouteComponent,
});

type ItemProps = {
  href: string;
  text: string;
};

function Item({ href, text }: ItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        buttonVariants({ variant: 'link' }),
        'border border-border w-44 h-16',
      )}
    >
      <span className="text-balance text-center">{text}</span>
    </Link>
  );
}

function RouteComponent() {
  return (
    <div className="flex w-full flex-col">
      <div className="my-8 grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-xl font-bold">Amenities</h3>
          <Separator />
          <ul className="flex items-center gap-4 mt-4 flex-wrap">
            <li>
              <Item href="/dashboard/amenities" text="View" />
            </li>
            <li>
              <Item href="/dashboard/amenities/new" text="New" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Categories</h3>
          <Separator />
          <ul className="flex items-center gap-4 mt-4 flex-wrap">
            <li>
              <Item href="/dashboard/categories" text="View" />
            </li>
            <li>
              <Item href="/dashboard/categories/new" text="New" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Cities</h3>
          <Separator />
          <ul className="flex items-center gap-4 mt-4 flex-wrap">
            <li>
              <Item href="/dashboard/cities" text="View" />
            </li>
            <li>
              <Item href="/dashboard/cities/new" text="New" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Point of Interests</h3>
          <Separator />
          <ul className="flex items-center gap-4 mt-4 flex-wrap">
            <li>
              <Item href="/dashboard/pois" text="View" />
            </li>
            <li>
              <Item href="/dashboard/pois/drafts" text="Drafts" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Users</h3>
          <Separator />
          <ul className="flex items-center gap-4 mt-4 flex-wrap">
            <li>
              <Item href="/dashboard/users" text="View" />
            </li>
            <li>
              <Item href="/dashboard/users/verify" text="Make User Verified" />
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold">Collections</h3>
          <Separator />
          <ul className="flex items-center gap-4 mt-4 flex-wrap">
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
