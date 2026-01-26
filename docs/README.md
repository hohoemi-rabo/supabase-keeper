# 開発チケット一覧

Supabase Keeper MVP開発のチケット管理。

## 進捗状況

| # | チケット | 状態 | 概要 |
|---|----------|------|------|
| 001 | [supabase-setup](./001-supabase-setup.md) | 未着手 | Supabaseプロジェクト・DB設計 |
| 002 | [auth-setup](./002-auth-setup.md) | 未着手 | 認証機能セットアップ |
| 003 | [project-list](./003-project-list.md) | 未着手 | プロジェクト一覧画面 |
| 004 | [project-form](./004-project-form.md) | 未着手 | プロジェクト登録/編集画面 |
| 005 | [ping-logs](./005-ping-logs.md) | 未着手 | Pingログ画面 |
| 006 | [keepalive-api](./006-keepalive-api.md) | 未着手 | keep-alive APIエンドポイント |
| 007 | [cron-api](./007-cron-api.md) | 未着手 | Cron用APIエンドポイント |
| 008 | [github-actions](./008-github-actions.md) | 未着手 | GitHub Actions設定 |
| 009 | [self-registration](./009-self-registration.md) | 未着手 | 自己登録（Self-ping設定） |
| 010 | [deployment](./010-deployment.md) | 未着手 | デプロイ設定 |

## 推奨実装順序

```
001 → 002 → 006 → 003 → 004 → 005 → 007 → 008 → 009 → 010
 │      │     │     │     │     │     │     │     │     │
 DB   認証  API  一覧  登録  ログ  Cron  GHA  自己  本番
```

1. **001-supabase-setup**: 最初にDBを構築
2. **002-auth-setup**: 認証基盤を構築
3. **006-keepalive-api**: 自己ping用APIを先に作成
4. **003-project-list**: ダッシュボード画面
5. **004-project-form**: 登録/編集機能
6. **005-ping-logs**: ログ表示機能
7. **007-cron-api**: 定期実行API
8. **008-github-actions**: 定期実行設定
9. **009-self-registration**: 自己登録
10. **010-deployment**: 本番デプロイ

## Todo記法

```markdown
- [ ] 未完了
- [x] 完了
```
