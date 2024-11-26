import { Link } from "react-router";

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

export default function Card({
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
        src={image}
        alt=""
        className="aspect-video w-48 rounded-lg object-cover"
      />

      <div>
        <div className="line-clamp-1 text-lg font-semibold capitalize leading-none tracking-tight">
          {name}
        </div>
        <div className="my-1 line-clamp-1 text-sm text-muted-foreground">
          {city} / {state}
        </div>

        <div className="text-sm font-semibold leading-none tracking-tight text-primary">
          {categoryName}
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 hover:bg-muted">
      {isCardClickable ? (
        <button
          onClick={() =>
            onCardClick?.({
              categoryName,
              city,
              id,
              image,
              name,
              state,
            })
          }
          className="flex gap-8 text-left"
        >
          {innerContent}
        </button>
      ) : (
        <Link to={`/p/${id}`} className="flex gap-8">
          {innerContent}
        </Link>
      )}
    </div>
  );
}
