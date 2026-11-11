# ip-logger

アクセスしてきた訪問者のIPアドレスをCloudflare D1に記録し、訪問者には `Not Found` (404) だけを返すWorkerです。

## セットアップ

```bash
npm install
npx wrangler login

# 1. D1データベース作成 → 表示された database_id を wrangler.toml に貼る
npx wrangler d1 create ip-logger-db

# 2. テーブル作成
npm run db:init

# 3. デプロイ
npm run deploy
```

## 記録の確認

```bash
npm run logs
```

任意のSQLを実行する場合:

```bash
npx wrangler d1 execute ip-logger-db --remote --command "SELECT ip, COUNT(*) c FROM visits GROUP BY ip ORDER BY c DESC"
```

## 記録される項目

ip / method / path / user_agent / country / visited_at

## ローカル確認

```bash
npm run db:init:local
npm run dev
curl -i http://localhost:8787/
```
"# ip-logger" 
