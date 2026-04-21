import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export type Memo = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const DATA_FILE = path.join(process.cwd(), 'data', 'memos.json');

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

export function getMemos(): Memo[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Memo[];
}

export function createMemo(content: string): Memo {
  const memos = getMemos();
  const now = new Date().toISOString();
  const memo: Memo = { id: randomUUID(), content, createdAt: now, updatedAt: now };
  memos.unshift(memo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2), 'utf-8');
  return memo;
}

export function updateMemo(id: string, content: string): Memo | null {
  const memos = getMemos();
  const index = memos.findIndex((m) => m.id === id);
  if (index === -1) return null;
  memos[index] = { ...memos[index], content, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2), 'utf-8');
  return memos[index];
}

export function deleteMemo(id: string): boolean {
  const memos = getMemos();
  const next = memos.filter((m) => m.id !== id);
  if (next.length === memos.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2), 'utf-8');
  return true;
}
