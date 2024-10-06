import AppMessage from "~/components/blocks/app-message";

export default function Page() {
  return (
    <div className="">
      <AppMessage
        emptyMessage="Select an action from sidebar"
        showBackButton={false}
      />
    </div>
  );
}
