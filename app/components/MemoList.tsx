'use client';

import { useRef, useState, useTransition } from 'react';
import type { Memo } from '../lib/store';
import { createMemoAction, updateMemoAction, deleteMemoAction } from '../actions';

export default function MemoList({ initialMemos }: { initialMemos: Memo[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const createRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createMemoAction(formData);
      if (createRef.current) createRef.current.value = '';
    });
  }

  function handleUpdate(id: string, formData: FormData) {
    startTransition(async () => {
      await updateMemoAction(id, formData);
      setEditingId(null);
    });
  }

  function handleCmdEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMemoAction(id);
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">

      <form
        action={handleCreate}
        className="mb-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm"
      >
        <textarea
          ref={createRef}
          name="content"
          autoFocus
          rows={4}
          placeholder="メモを入力..."
          onKeyDown={handleCmdEnter}
          className="w-full resize-none bg-transparent px-0 py-1 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none [caret-shape:underscore]"
        />
        <div className="mt-3 flex gap-2 justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            保存
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">

        {initialMemos.map((memo) => (
          <div
            key={memo.id}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm [animation:memo-in_0.35s_ease-out_both]"
          >
            {editingId === memo.id ? (
              <form action={(fd) => handleUpdate(memo.id, fd)}>
                <textarea
                  ref={editRef}
                  name="content"
                  defaultValue={memo.content}
                  autoFocus
                  rows={4}
                  onKeyDown={handleCmdEnter}
                  className="w-full resize-none bg-transparent px-0 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
                <div className="mt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    保存
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {memo.content}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    {new Date(memo.updatedAt).toLocaleString('ja-JP')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(memo.id, memo.content)}
                      className="text-xs px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 transition-colors"
                    >
                      {copiedId === memo.id ? 'コピー済み' : 'コピー'}
                    </button>
                    <button
                      onClick={() => setEditingId(memo.id)}
                      className="text-xs px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(memo.id)}
                      disabled={isPending}
                      className="text-xs px-3 py-1 rounded-md border border-red-200 dark:border-red-900 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-400 transition-colors disabled:opacity-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
