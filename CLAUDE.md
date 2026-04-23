@AGENTS.md

## 開発方針

- **テストファースト必須**：実装コードより先にテストを書く。テストが失敗することを確認してから実装する
- **関数型プログラミング**：ミュータブルな状態を避ける。`let` より `const`、ガード節による状態管理より IIFE などで初期化時に確定させる。`Object.freeze()` や `Readonly` 型の付与は本質的でないため不要

## ファイル命名規則

- `.ts` / `.tsx` のファイル名は lowerCamelCase（例: `storeJson.ts`, `storeSqlite.ts`）

## ストアアーキテクチャ

永続化層は `app/lib/store.ts` で定義した `Store` インターフェースに基づき実装を差し替える設計。

- `app/lib/storeJson.ts` — JSON ファイル実装（`createJsonStore(filePath)`）
- `app/lib/storeSqlite.ts` — SQLite 実装（`createSqliteStore(dbPath)`）
- 切り替えは環境変数で行う（後述）
- 新たな永続化バックエンドを追加する場合も同じインターフェースを実装する

### 環境変数

| 変数 | 値 | デフォルト |
|---|---|---|
| `STORAGE_TYPE` | `json` / `sqlite` | `json` |
| `STORAGE_PATH` | ファイルパス | `./data/memos.json` または `./data/memos.db` |

## SQLite の注意事項

- `better-sqlite3` はネイティブバインディングが必要。`pnpm-workspace.yaml` の `onlyBuiltDependencies` に登録してビルドを有効化している
- `getMemos` の ORDER BY は `rowid DESC` を使用（`createdAt` は同一ミリ秒内で重複しうるため）
- Next.js は `better-sqlite3` を自動的に `serverExternalPackages` として扱うため、`next.config.ts` への追記は不要
