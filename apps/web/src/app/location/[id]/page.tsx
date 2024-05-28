import EmptyContent from "@/components/blocks/EmptyContent";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api, rpc } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};

async function getLocation(id: string) {
  return rpc(() =>
    api.locations[":id"].$get({
      param: {
        id,
      },
    })
  );
}

export default async function Page({ params: { id } }: Props) {
  const location = await getLocation(id);

  return (
    <main className="container mt-16">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/search?c=${location.categoryId}`}>
              {location.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {location.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-32">
        <Carousel
          className="w-full mx-auto lg:min-w-96 max-w-xl mt-8"
          opts={{}}
        >
          <CarouselContent>
            {location.media.map((media, index) => (
              <CarouselItem key={index}>
                <div className="rounded-lg">
                  <img
                    className="object-cover w-full h-full rounded-lg"
                    src={media.url}
                    alt={media.alt}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight capitalize mt-8">
            {location.name}
          </h1>

          <p className="mt-2 text-sm text-gray-500">{location.category.name}</p>

          <p className="mt-2 text-sm text-gray-500">{location.description}</p>

          <h2 className="mt-8 text-lg font-bold">Information</h2>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Has WiFi</TableCell>
                <TableCell className="text-right">
                  {location.hasWifi ? "Yes" : "No"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Phone</TableCell>
                <TableCell className="text-right">{location.phone}</TableCell>
              </TableRow>

              {location.website && (
                <TableRow>
                  <TableCell className="font-medium">Website</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {location.website}
                    </a>
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell className="font-medium">Address</TableCell>
                <TableCell className="text-right">
                  {location.address.line1}
                  <br />
                  {location.address.line2}
                  <br />
                  {location.address.city}, {location.address.state} /{" "}
                  {location.address.country}
                  <br />
                  {location.address.postalCode}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Price level</TableCell>
                <TableCell className="flex justify-end">
                  <Progress
                    value={location.priceLevel * 19.8}
                    className="max-w-32"
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  Accessibility level
                </TableCell>
                <TableCell className="flex justify-end">
                  <Progress
                    value={location.accessibilityLevel * 19.8}
                    className="max-w-32"
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Tags</TableCell>
                <TableCell className="flex flex-col items-end gap-2">
                  {location.tags.map((tag) => (
                    <Badge key={tag} className="mr-2">
                      {tag}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <hr className="my-8" />

      {/* reviews */}
      <h2 className="text-2xl font-bold">Reviews</h2>

      <EmptyContent className="mt-16" showBackButton={false} />
    </main>
  );
}
