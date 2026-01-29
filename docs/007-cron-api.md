# 007: Cron用APIエンドポイント

## 概要

GitHub Actionsから呼び出される、全プロジェクトへのPing実行を行うAPIエンドポイントを実装する。

## 関連セクション

- REQUIREMENTS.md: 8. Cron実行仕様

## エンドポイント仕様

```
POST /api/cron/ping
Authorization: Bearer <KEEPER_CRON_SECRET>
```

### 処理フロー

1. Authorization ヘッダーを検証
2. `createAdminClient()` で有効な全プロジェクトを取得（is_enabled = true）
3. 各プロジェクトの keep-alive URL に `Promise.all` で並列fetch（タイムアウト10秒）
4. 結果を `ping_logs` に保存
5. `projects` のステータスを更新（ok/warn/down判定）

## タスク

### APIエンドポイント実装

- [x] `app/api/cron/ping/route.ts` 作成
- [x] Bearer Token認証実装

### Ping実行ロジック

- [x] 並列fetchの実装（Promise.all）
- [x] タイムアウト設定（10秒）
- [x] レイテンシ計測

### ログ保存・ステータス更新

- [x] ping_logsへの挿入処理
- [x] consecutive_failures の更新ロジック
- [x] status の判定・更新ロジック（ok/warn/down）
- [x] last_ping_at, last_success_at の更新

### エラーハンドリング

- [x] 個別プロジェクトの失敗が全体に影響しない（Promise.all内で各自try/catch）
- [x] ネットワークエラーのハンドリング
- [x] タイムアウトのハンドリング（AbortSignal.timeout）

## ファイル構成

```
src/
  app/
    api/
      cron/
        ping/
          route.ts        # POST /api/cron/ping
```

## レスポンス例

```json
{
  "success": true,
  "results": { "total": 3, "succeeded": 2, "failed": 1 },
  "details": [
    { "projectId": "uuid", "projectName": "App A", "success": true, "status": 200, "latencyMs": 150 },
    { "projectId": "uuid", "projectName": "App B", "success": false, "error": "The operation was aborted due to timeout" }
  ]
}
```

## 完了条件

- [x] `/api/cron/ping` が実装されている
- [x] Bearer Token認証が機能する
- [x] 全有効プロジェクトにPingが送信される
- [x] ping_logsに結果が保存される
- [x] projectsのステータスが正しく更新される
- [x] 個別の失敗が全体に影響しない
