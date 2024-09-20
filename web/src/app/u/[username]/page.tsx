import AppMessage from '@/components/blocks/app-message';

export default async function Page() {
  return (
    <div>
      <AppMessage
        className="mt-16"
        emptyMessage="User has no content"
      />
    </div>
  );
}
