import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <img
            src="/logo.png"
            className="size-24 min-h-24 min-w-24 grayscale"
          />
        </EmptyMedia>
        <EmptyTitle>No entries found</EmptyTitle>
        <EmptyDescription>
          You haven't created any diary entries yet.
        </EmptyDescription>
        <EmptyDescription>
          Start by adding a new entry to capture your thoughts and experiences.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
