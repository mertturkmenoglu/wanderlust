import { GlobeIcon, LockIcon } from "lucide-react";
import { DiaryEntryDto } from "~/lib/dto";

type Props = {
  entry: DiaryEntryDto;
};

export default function EntryCard({ entry }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div>
        {entry.shareWithFriends ? (
          <GlobeIcon className="size-4" />
        ) : (
          <LockIcon className="size-4" />
        )}
      </div>
      <div>
        <div className="text-primary hover:underline">{entry.title}</div>
        <div className="text-sm text-muted-foreground">
          {new Date(entry.date).toLocaleDateString("en-US", {
            dateStyle: "medium",
          })}
        </div>
      </div>
    </div>
  );
}