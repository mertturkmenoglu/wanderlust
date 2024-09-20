'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateUserPage(username: string) {
  revalidatePath(`/user/${username}`);
}
