import AppMessage from '@/components/blocks/AppMessage';

export default async function Page() {
  return (
    <div>
      <AppMessage
        className="my-16"
        emptyMessage="This user has no activity"
        showBackButton={false}
      />
    </div>
  );
}
