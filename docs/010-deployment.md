# 010: デプロイ設定

## 概要

VercelへのデプロイとCI/CD設定を行う。

## 関連セクション

- REQUIREMENTS.md: 11. 技術スタック

## タスク

### Vercelプロジェクト設定

- [ ] Vercelに新規プロジェクト作成
- [ ] GitHubリポジトリと連携

### 環境変数設定（Vercel）

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `KEEPALIVE_TOKEN`
- [ ] `KEEPER_CRON_SECRET`

### ビルド設定

- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### ドメイン設定（任意）

- [ ] カスタムドメイン設定（必要な場合）

### 動作確認

- [ ] デプロイが成功する
- [ ] 本番環境でログインできる
- [ ] 本番環境でダッシュボードが表示される
- [ ] 本番環境で `/api/keepalive` が動作する
- [ ] 本番環境で `/api/cron/ping` が動作する

### GitHub Actions更新

- [ ] `KEEPER_CRON_URL` を本番URLに更新

## 環境変数一覧

| 変数名 | 説明 | 設定場所 |
|--------|------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL | Vercel |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Anon Key | Vercel |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Service Role Key | Vercel |
| KEEPALIVE_TOKEN | 自己ping用Token | Vercel |
| KEEPER_CRON_SECRET | Cron API認証用 | Vercel, GitHub |
| KEEPER_CRON_URL | Cron APIのURL | GitHub |

## 完了条件

- [ ] Vercelへのデプロイが成功する
- [ ] 本番環境で全機能が動作する
- [ ] GitHub Actionsから本番APIが呼び出せる
