import { useLoaderData } from "react-router";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as ShadcnCarousel,
} from "~/components/ui/carousel";
import { loader } from "../route";

export default function Carousel() {
  const { poi } = useLoaderData<typeof loader>();
  const media = poi.media;

  return (
    <ShadcnCarousel className="mx-auto flex h-min w-11/12 justify-center lg:w-full">
      <CarouselContent>
        {media.map((media, index) => (
          <CarouselItem key={index} className="mx-auto flex justify-center">
            <div className="flex h-[512px] flex-col items-center justify-center overflow-hidden rounded-lg lg:w-full">
              <img
                className="rounded-lg object-cover h-[96%]"
                src={media.url}
                alt={media.alt}
              />
              {media.caption !== null && (
                <div className="text-center text-xs text-muted-foreground mt-2 tracking-tighter">
                  {media.caption}
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </ShadcnCarousel>
  );
}
