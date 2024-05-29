import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as ShadcnCarousel,
} from '@/components/ui/carousel';
import { Media } from '@/lib/types';

type Props = {
  media: Media[];
};

export default function Carousel({ media }: Props) {
  return (
    <ShadcnCarousel className="mx-auto mt-8 w-full max-w-xl lg:min-w-96">
      <CarouselContent>
        {media.map((media, index) => (
          <CarouselItem key={index}>
            <div className="rounded-lg">
              <img
                className="h-full w-full rounded-lg object-cover"
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
