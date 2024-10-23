import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  image: string | null;
  fullName: string;
  username: string;
};

export default function UserCard({
  image,
  fullName,
  username,
  className,
}: Props) {
  return (
    <Card className={cn("flex gap-4 p-2 items-center", className)}>
      <img
        src={image ?? "/profile.png"}
        className="aspect-square w-12 rounded-lg object-cover"
      />

      <div>
        <div className="line-clamp-1 text-sm capitalize">{fullName}</div>
        <div className="my-1 text-xs text-muted-foreground">@{username}</div>
      </div>
    </Card>
  );
}
