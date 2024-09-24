import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as ShadcnCarousel,
} from '~/components/ui/carousel';
import { Media } from '~/lib/dto';

type Props = {
  media: Media[];
};

export default function Carousel({ media }: Props) {
  return (
    <ShadcnCarousel className="mx-auto flex h-min w-11/12 justify-center lg:w-full">
      <CarouselContent>
        {media.map((media, index) => (
          <CarouselItem
            key={index}
            className="mx-auto flex justify-center"
          >
            <div className="flex h-[512px] w-11/12 items-center justify-center overflow-hidden rounded-lg lg:w-full">
              <img
                className="rounded-lg object-cover"
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