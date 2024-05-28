import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as ShadcnCarousel,
} from "@/components/ui/carousel";
import { Media } from "@/lib/types";

type Props = {
  media: Media[];
};

export default function Carousel({ media }: Props) {
  return (
    <ShadcnCarousel className="w-full mx-auto lg:min-w-96 max-w-xl mt-8">
      <CarouselContent>
        {media.map((media, index) => (
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
    </ShadcnCarousel>
  );
}
