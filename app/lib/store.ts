import path from 'path';

export type Memo = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export interface Store {
  getMemos(): Promise<Memo[]>;
  createMemo(content: string): Promise<Memo>;
  updateMemo(id: string, content: string): Promise<Memo | null>;
  deleteMemo(id: string): Promise<boolean>;
}

function resolveStoragePath(defaultName: string): string {
  return process.env.STORAGE_PATH ?? path.join(process.cwd(), 'data', defaultName);
}

const storePromise: Promise<Store> = (() => {
  const type = (process.env.STORAGE_TYPE ?? 'json').toLowerCase();
  if (type === 'sqlite') {
    return import('./storeSqlite').then(({ createSqliteStore }) =>
      createSqliteStore(resolveStoragePath('memos.db'))
    );
  }
  return import('./storeJson').then(({ createJsonStore }) =>
    createJsonStore(resolveStoragePath('memos.json'))
  );
})();

export function getStore(): Promise<Store> {
  return storePromise;
}
