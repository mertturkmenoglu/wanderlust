import { ipx } from '@/lib/ipx';
import { Link } from '@tanstack/react-router';

export type AutocompleteItemInfo = {
  id: string;
  name: string;
  image: string;
  categoryName: string;
  city: string;
  state: string;
};

type Props = AutocompleteItemInfo & {
  isCardClickable: boolean;
  onCardClick?: (v: AutocompleteItemInfo) => void;
};

export function Card({
  name,
  image,
  id,
  categoryName,
  city,
  state,
  isCardClickable,
  onCardClick,
}: Props) {
  const innerContent = (
    <>
      <img
        src={ipx(image, 'w_256')}
        alt=""
        className="aspect-video w-24 md:w-48 rounded-lg object-cover"
      />

      <div>
        <div className="line-clamp-1 text-base md:text-lg font-semibold capitalize leading-none tracking-tight">
          {name}
        </div>
        <div className="my-1 line-clamp-1 text-xs md:text-sm text-muted-foreground">
          {city} / {state}
        </div>

        <div className="text-xs line-clamp-1 md:text-sm font-semibold leading-none tracking-tight text-primary">
          {categoryName}
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 hover:bg-muted">
      {isCardClickable ? (
        <button
          type="button"
          onClick={() => {
            if (onCardClick) {
              onCardClick({
                categoryName,
                city,
                id,
                image,
                name,
                state,
              });
            }
          }}
          className="flex gap-2 md:gap-8 text-left"
        >
          {innerContent}
        </button>
      ) : (
        <Link
          to="/p/$id"
          params={{ id }}
          className="flex gap-2 md:gap-8"
        >
          {innerContent}
        </Link>
      )}
    </div>
  );
}
