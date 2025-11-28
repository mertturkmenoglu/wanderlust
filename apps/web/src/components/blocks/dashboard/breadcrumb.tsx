import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@tanstack/react-router';

type TItem = {
  name: string;
  href: string;
};

type Props = {
  items: TItem[];
};

export function DashboardBreadcrumb({ items }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.slice(0, -1).map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2"
          >
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem key={item.href}>
              <BreadcrumbLink asChild>
                <Link to={item.href}>{item.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
        <BreadcrumbSeparator className="text-primary" />
        <BreadcrumbItem>
          <BreadcrumbPage>{items.at(-1)?.name ?? '-'}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
