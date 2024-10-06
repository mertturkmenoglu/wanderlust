import AppMessage from "~/components/blocks/app-message";

export default function Page() {
  return (
    <div>
      <AppMessage
        emptyMessage="This page is not implemented yet"
        showBackButton={false}
      />
    </div>
  );
}
