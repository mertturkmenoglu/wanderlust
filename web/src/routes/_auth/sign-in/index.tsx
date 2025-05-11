import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { SignInCard } from './-card';

const schema = z.object({
  signInModal: z.boolean().optional().catch(false),
});

export const Route = createFileRoute('/_auth/sign-in/')({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    if (auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
  validateSearch: schema,
});

function RouteComponent() {
  return <SignInCard isModal={false} />;
}
