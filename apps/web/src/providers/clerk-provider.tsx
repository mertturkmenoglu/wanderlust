import { ClerkProvider } from '@clerk/nextjs';
import { PropsWithChildren } from 'react';

export default function Provider({ children }: PropsWithChildren) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
