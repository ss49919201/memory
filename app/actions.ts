'use server';

import { revalidatePath } from 'next/cache';
import { createMemo, updateMemo, deleteMemo } from './lib/store';

export async function createMemoAction(formData: FormData) {
  const content = (formData.get('content') as string | null)?.trim();
  if (!content) return;
  createMemo(content);
  revalidatePath('/');
}

export async function updateMemoAction(id: string, formData: FormData) {
  const content = (formData.get('content') as string | null)?.trim();
  if (!content) return;
  updateMemo(id, content);
  revalidatePath('/');
}

export async function deleteMemoAction(id: string) {
  deleteMemo(id);
  revalidatePath('/');
}
