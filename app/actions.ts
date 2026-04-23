'use server';

import { revalidatePath } from 'next/cache';
import { getStore } from './lib/store';

export async function createMemoAction(formData: FormData) {
  const content = (formData.get('content') as string | null)?.trim();
  if (!content) return;
  await (await getStore()).createMemo(content);
  revalidatePath('/');
}

export async function updateMemoAction(id: string, formData: FormData) {
  const content = (formData.get('content') as string | null)?.trim();
  if (!content) return;
  await (await getStore()).updateMemo(id, content);
  revalidatePath('/');
}

export async function deleteMemoAction(id: string) {
  await (await getStore()).deleteMemo(id);
  revalidatePath('/');
}
