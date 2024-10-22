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
    <Card className={cn("flex gap-8 p-4 flex-1 items-center", className)}>
      <img
        src={image ?? "/profile.png"}
        className="aspect-square w-16 rounded-lg object-cover"
      />

      <div>
        <div className="line-clamp-1 text-lg font-semibold capitalize leading-none tracking-tight">
          {fullName}
        </div>
        <div className="my-1 line-clamp-1 text-sm text-muted-foreground">
          @{username}
        </div>
      </div>
    </Card>
  );
}
