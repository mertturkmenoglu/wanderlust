import { fetchClient } from '@/lib/api';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { SignInCard } from './-card';

const schema = z.object({
  signInModal: z.boolean().optional().catch(false),
});

export const Route = createFileRoute('/_auth/sign-in/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await fetchClient.GET('/api/v2/auth/me');
    if (res.data !== undefined) {
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
