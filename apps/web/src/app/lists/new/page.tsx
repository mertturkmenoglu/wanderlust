import { auth } from '@clerk/nextjs/server';
import NewListForm from './_components/form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  auth().protect();

  return (
    <div>
      <NewListForm />
    </div>
  );
}
