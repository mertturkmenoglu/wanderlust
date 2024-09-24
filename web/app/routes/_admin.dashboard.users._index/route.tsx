import AppMessage from "~/components/blocks/app-message";

export default function Page() {
  return (
    <div>
      <AppMessage emptyMessage="In progress" showBackButton={false} />
    </div>
  );
}
