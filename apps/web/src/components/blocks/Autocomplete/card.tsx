import Link from 'next/link';

type Props = {
  id: string;
  name: string;
  tags: string[];
  image: string;
  categoryId: number;
};

export default function Card({ name, tags, categoryId, image, id }: Props) {
  return (
    <div className="p-2">
      <Link
        href={`/location/${id}`}
        className="flex gap-8"
      >
        <img
          src={image}
          alt=""
          className="aspect-video w-48 rounded-lg object-cover"
        />

        <div>
          <div className=''>{name}</div>
          <div>{JSON.stringify(tags)}</div>
          <div>{categoryId}</div>
        </div>
      </Link>
    </div>
  );
}
