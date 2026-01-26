# 009: 自己登録（Self-ping設定）

## 概要

中央Dashboard自身をprojectsテーブルに登録し、他のプロジェクトと同様にkeep-aliveされるようにする。

## 関連セクション

- REQUIREMENTS.md: 10. 中央Dashboard自己ping機能

## 背景

中央Dashboard自体もSupabase無料プランで運用するため、自分自身もpause防止対象に含める必要がある。

## タスク

### 初期データ投入

- [ ] 自己ping用のTokenを生成
- [ ] projectsテーブルに自分自身を登録

```sql
INSERT INTO projects (
  user_id,
  name,
  keepalive_url,
  token,
  is_enabled,
  notes
) VALUES (
  'YOUR_USER_ID',  -- 自分のauth.users.id
  'Supabase Keeper (Self)',
  'https://your-app.vercel.app/api/keepalive',
  'YOUR_KEEPALIVE_TOKEN',
  true,
  '中央Dashboard自身のkeep-alive用'
);
```

### 環境変数確認

- [ ] `KEEPALIVE_TOKEN` が設定されていることを確認
- [ ] projectsテーブルのtokenと一致していることを確認

### 動作確認

- [ ] ダッシュボードに自分自身が表示される
- [ ] 「今すぐPing」で自己pingが成功する
- [ ] Cron実行時に自己pingが含まれる

## 注意事項

- 自己pingは無限ループにならない（/api/keepalive は heartbeat を更新するだけ）
- 本番デプロイ後にURLを更新する必要がある

## 完了条件

- [ ] projectsテーブルに自分自身が登録されている
- [ ] Tokenが環境変数と一致している
- [ ] 「今すぐPing」で成功する
- [ ] Cron実行時にpingされる
