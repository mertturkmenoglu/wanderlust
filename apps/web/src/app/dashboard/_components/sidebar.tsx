import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  className?: string;
};

export default function Sidebar({ className }: Props) {
  return (
    <div className={cn('flex flex-col', className)}>
      <ul className="flex flex-col">
        <li>
          <Button
            asChild
            variant="link"
            className="px-0"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </li>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="link"
              className="px-0"
            >
              Locations
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="ml-4">
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/locations">View</Link>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/locations/new">New Location</Link>
                </Button>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="link"
              className="px-0"
            >
              Events
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="ml-4">
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/events">View</Link>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/events/new">New Event</Link>
                </Button>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="link"
              className="px-0"
            >
              Users
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="ml-4">
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/users">View</Link>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/users/verify">Make User Verified</Link>
                </Button>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="link"
              className="px-0"
            >
              Reports
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="ml-4">
              <li>
                <Button
                  asChild
                  variant="link"
                  className="px-0"
                >
                  <Link href="/dashboard/reports">View</Link>
                </Button>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </ul>
    </div>
  );
}
