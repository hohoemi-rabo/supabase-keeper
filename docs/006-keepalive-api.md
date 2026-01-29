# 006: keep-alive APIエンドポイント

## 概要

中央Dashboard自身のkeep-alive用エンドポイントを実装する。他プロジェクトと同じ仕組みで自己pingされる。

## 関連セクション

- REQUIREMENTS.md: 7. keep-aliveエンドポイント仕様
- REQUIREMENTS.md: 10. 中央Dashboard自己ping機能

## エンドポイント仕様

```
GET /api/keepalive?token=XXXX
```

### レスポンス

成功時 (200):
```json
{ "ok": true, "timestamp": "2024-01-01T00:00:00.000Z" }
```

認証エラー (401):
```json
{ "error": "Unauthorized" }
```

DBエラー (500):
```json
{ "error": "エラーメッセージ" }
```

## タスク

### APIエンドポイント実装

- [x] `app/api/keepalive/route.ts` 作成
- [x] Token検証ロジック実装（`KEEPALIVE_TOKEN` 環境変数と比較）
- [x] heartbeatテーブル更新処理（`createAdminClient` 使用）
- [x] エラーハンドリング

### 環境変数

- [x] `KEEPALIVE_TOKEN` を `.env.local` に実際の値で設定
- [x] `KEEPER_CRON_SECRET` を `.env.local` に実際の値で設定

## ファイル構成

```
src/
  app/
    api/
      keepalive/
        route.ts        # GET /api/keepalive?token=XXXX
```

## 完了条件

- [x] `/api/keepalive` が実装されている
- [x] Token認証が機能する
- [x] heartbeatテーブルが更新される
- [x] 正しいレスポンスが返却される
