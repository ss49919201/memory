import { getStore } from './lib/store';
import MemoList from './components/MemoList';

export default async function Home() {
  const memos = await (await getStore()).getMemos();
  return <MemoList initialMemos={memos} />;
}
