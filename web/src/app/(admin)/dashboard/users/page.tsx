import AppMessage from '@/components/blocks/app-message';

export default function Page() {
  return (
    <AppMessage
      emptyMessage="In progress"
      showBackButton={false}
    />
  );
}
