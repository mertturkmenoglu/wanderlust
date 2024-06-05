import CollapsibleText from '@/components/blocks/CollapsibleText';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api, rpc } from '@/lib/api';
import { getAuthHeader } from '@/lib/headers';
import { EllipsisVertical, FlagIcon, Plus } from 'lucide-react';
import AddToListButton from './_components/add-to-list-button';
import BookmarkButton from './_components/bookmark-button';
import Breadcrumb from './_components/breadcrumb';
import Carousel from './_components/carousel';
import InformationTable from './_components/info/table';
import LocationMap from './_components/location-map';
import Reviews from './_components/reviews';
import ShareButton from './_components/share-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};

async function getLocation(id: string) {
  return rpc(() =>
    api.locations[':id'].$get(
      {
        param: {
          id,
        },
      },
      getAuthHeader()
    )
  );
}

export default async function Page({ params: { id } }: Props) {
  const { data: location, metadata } = await getLocation(id);

  return (
    <main className="container mx-auto mt-8 px-4 md:mt-16 md:px-0">
      <Breadcrumb
        categoryId={location.category.id}
        categoryName={location.category.name}
        locationName={location.name}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-32">
        <Carousel media={location.media} />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="line-clamp-2 scroll-m-20 text-4xl font-extrabold capitalize tracking-tight">
              {location.name}
            </h2>

            <div className="flex items-center">
              <ShareButton />

              <BookmarkButton
                locationId={location.id}
                isBookmarked={metadata.isBookmarked}
              />

              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="block"
                  >
                    <Button
                      className="flex items-center justify-center rounded-full"
                      variant="ghost"
                      size="icon"
                    >
                      <EllipsisVertical className="size-6" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className=" w-32 space-y-2 p-2"
                    align="end"
                  >
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <Button
                        className="flex w-full justify-start hover:no-underline"
                        variant="link"
                        size="sm"
                      >
                        <FlagIcon className="mr-2 size-4" />
                        Report
                      </Button>
                    </DropdownMenuItem>

                    <DialogTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer p-0">
                        <Button
                          className="flex w-full justify-start hover:no-underline"
                          variant="link"
                          size="sm"
                          type="button"
                        >
                          <Plus className="mr-2 size-4" />
                          Add to list
                        </Button>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a list</DialogTitle>
                    <DialogDescription>[[Lists]]</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <AddToListButton locationId={id} />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500">{location.category.name}</p>
          <CollapsibleText text={location.description} />
          <h2 className="mt-8 text-lg font-bold">Information</h2>
          <InformationTable location={location} />
        </div>
      </div>

      <LocationMap location={location} />

      <hr className="my-8" />

      <Reviews
        locationId={location.id}
        name={location.name}
      />
    </main>
  );
}
