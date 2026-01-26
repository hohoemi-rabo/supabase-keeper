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
2. 有効な全プロジェクトを取得（is_enabled = true）
3. 各プロジェクトの keep-alive URL に並列でfetch
4. 結果を ping_logs に保存
5. projects の状態を更新

## ステータス判定ロジック

| ステータス | 条件 |
|-----------|------|
| 🟢 ok | 直近Pingで成功、かつ連続失敗 < 2 |
| 🟡 warn | 連続失敗 >= 2 |
| 🔴 down | 連続失敗 >= 5、または3日以上成功なし |

## タスク

### APIエンドポイント実装

- [ ] `app/api/cron/ping/route.ts` 作成
- [ ] Bearer Token認証実装
- [ ] 有効プロジェクト取得ロジック

### Ping実行ロジック

- [ ] 並列fetchの実装（Promise.allSettled使用）
- [ ] タイムアウト設定（10秒）
- [ ] レイテンシ計測

### ログ保存

- [ ] ping_logsへの挿入処理
- [ ] 成功/失敗の判定

### ステータス更新

- [ ] consecutive_failures の更新ロジック
- [ ] status の判定・更新ロジック
- [ ] last_ping_at, last_success_at の更新

### エラーハンドリング

- [ ] 個別プロジェクトの失敗が全体に影響しないように
- [ ] ネットワークエラーのハンドリング
- [ ] タイムアウトのハンドリング

## 環境変数

```env
KEEPER_CRON_SECRET=your-secret-here
```

## レスポンス

```json
{
  "success": true,
  "results": {
    "total": 5,
    "succeeded": 4,
    "failed": 1
  },
  "details": [
    {
      "projectId": "uuid",
      "projectName": "Project A",
      "success": true,
      "status": 200,
      "latencyMs": 150
    },
    {
      "projectId": "uuid",
      "projectName": "Project B",
      "success": false,
      "error": "Timeout"
    }
  ]
}
```

## 完了条件

- [ ] `/api/cron/ping` が実装されている
- [ ] Bearer Token認証が機能する
- [ ] 全有効プロジェクトにPingが送信される
- [ ] ping_logsに結果が保存される
- [ ] projectsのステータスが正しく更新される
- [ ] 個別の失敗が全体に影響しない
