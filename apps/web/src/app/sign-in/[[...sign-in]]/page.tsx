import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="container mx-auto my-32 flex justify-center">
      <SignIn />
    </div>
  );
}
