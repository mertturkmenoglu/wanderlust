import { Link } from "@remix-run/react";

type Props = {
  id: string;
  name: string;
  image: string;
  categoryName: string;
  city: string;
  state: string;
};

export default function Card({
  name,
  image,
  id,
  categoryName,
  city,
  state,
}: Props) {
  return (
    <div className="p-4 hover:bg-muted">
      <Link to={`/p/${id}`} className="flex gap-8">
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
      </Link>
    </div>
  );
}
