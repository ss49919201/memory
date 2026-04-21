import { getMemos } from './lib/store';
import MemoList from './components/MemoList';

export default async function Home() {
  const memos = getMemos();
  return <MemoList initialMemos={memos} />;
}
