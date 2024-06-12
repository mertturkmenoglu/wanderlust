import AppMessage from '@/components/blocks/AppMessage';

export default function Page() {
  return (
    <AppMessage
      emptyMessage="In progress"
      showBackButton={false}
    />
  );
}
