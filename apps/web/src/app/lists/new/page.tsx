import { auth } from '@clerk/nextjs/server';
import NewListForm from './_components/form';

export default function Page() {
  auth().protect();

  return (
    <div>
      <NewListForm />
    </div>
  );
}
