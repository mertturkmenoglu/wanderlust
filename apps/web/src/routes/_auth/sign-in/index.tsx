import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { SignInCard } from './-card';

export const Route = createFileRoute('/_auth/sign-in/')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
  validateSearch: z.object({
    // oxlint-disable-next-line prefer-await-to-then
    signInModal: z.boolean().optional().catch(false),
  }),
});

function RouteComponent() {
  return <SignInCard isModal={false} />;
}
