import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@tanstack/react-router';
import React from 'react';

type Props = {
  items: Array<{ name: string; href: string }>;
};

export default function DashboardBreadcrumb({ items }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.slice(0, -1).map((item) => (
          <React.Fragment>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem key={item.href}>
              <BreadcrumbLink asChild>
                <Link to={item.href}>{item.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
        <BreadcrumbSeparator className="text-primary" />
        <BreadcrumbItem>
          <BreadcrumbPage>{items.at(-1)?.name ?? '-'}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
