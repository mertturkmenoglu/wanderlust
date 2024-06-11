import AppMessage from '@/components/blocks/AppMessage';

export default function Page() {
  return (
    <main className="container mx-auto my-32 text-center">
      <AppMessage
        successMessage={
          <>
            <h2 className="text-4xl font-bold tracking-tight text-primary">
              We have recieved your report
            </h2>
            <div className="mt-8 text-base tracking-tighter">
              Thank you for making Wanderlust a better place.
            </div>
            <div className="text-base tracking-tighter">
              We will review your report and take appropriate action.
            </div>
          </>
        }
        className="my-16"
      />
    </main>
  );
}
