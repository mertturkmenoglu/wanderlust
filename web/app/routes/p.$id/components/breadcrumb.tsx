import { Link } from "@remix-run/react";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb,
} from "~/components/ui/breadcrumb";

type Props = {
  categoryId: number;
  categoryName: string;
  poiName: string;
};

export default function Breadcrumb({
  categoryId,
  categoryName,
  poiName,
}: Props) {
  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/search?locations[refinementList][categoryId][0]=${categoryId}`}
          >
            {categoryName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">{poiName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
