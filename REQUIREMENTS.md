# Supabase Keeper MVP仕様書

## 1. 背景・目的

### 1.1 課題

複数のWebサービス／MVPを個人で並行開発していると、Supabase（Freeプラン）を利用したプロジェクトが**7日間の非アクティブ状態で自動的にpause（一時停止）**される。

pause自体は復帰可能だが、以下の問題がある：

- プロジェクト数が多いと管理が煩雑
- 久しぶりに触るたびに管理画面でRestore操作が必要（5分程度かかることも）
- 「どれが止まりそうか」「どれが止まったか」が分からない

これにより**開発体験（DX）が著しく低下する**。

### 1.2 解決策

本サービス「Supabase Keeper」は、複数のSupabaseプロジェクトを**「見守る・起こす・可視化する」**ことでこの問題を解決する。

### 1.3 対象ユーザー

- MVP：自分自身の運用改善ツール
- 将来：Supabase無料プランを複数使っている個人開発者

---

## 2. MVPのゴール定義

以下を満たした時点でMVP達成とする：

- [ ] 複数Supabaseプロジェクトの状態を一覧で確認できる
- [ ] 各プロジェクトに対して毎日のkeep-alive（生存確認）を自動実行できる
- [ ] 失敗・異常状態が視覚的に分かる
- [ ] 中央Dashboard自身もpause防止される

### MVP対象外（明示）

- 外部ユーザー向け公開・登録機能
- 課金・プラン設計
- Slack / Email / Webhook 通知
- 権限ロール管理
- 高度な分析・統計

---

## 3. 全体構成（アーキテクチャ）

### 3.1 構成概要

本サービスは以下の2要素で構成される：

1. **中央管理Webサービス（Dashboard）** - Next.js + Vercel + Supabase
2. **各プロジェクト側のkeep-aliveエンドポイント** - 各プロジェクトに設置

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions                           │
│                    （1日1回実行）                             │
└─────────────────────┬───────────────────────────────────────┘
                      │ trigger
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Central Dashboard (Supabase Keeper)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Project一覧  │  │  Ping実行   │  │ 状態管理・ログ保存  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ※ 自分自身もkeep-alive対象として登録                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ fetch (並列)
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Project A   │ │ Project B   │ │ Project C   │
│ /api/       │ │ /api/       │ │ /api/       │
│ keepalive   │ │ keepalive   │ │ keepalive   │
└─────────────┘ └─────────────┘ └─────────────┘
```

### 3.2 設計方針（案A採用）

各プロジェクトに `/api/keepalive` エンドポイントを設置する方式を採用。

**採用理由：**

- ユーザーのSupabase認証情報（URLやanon key）を中央で預からない
- セキュリティリスクが低い
- ユーザーの心理的抵抗が少ない（将来公開時に重要）

---

## 4. 画面仕様（MVP）

### 4.1 プロジェクト一覧画面（Dashboard）

**目的：** 全プロジェクトの状態を一目で把握する

**表示項目：**

| 項目           | 説明                      |
| -------------- | ------------------------- |
| プロジェクト名 | 任意の表示名              |
| ステータス     | 🟢 OK / 🟡 WARN / 🔴 DOWN |
| 最終Ping時刻   | 最後にPingを実行した日時  |
| 最終成功時刻   | 最後にPingが成功した日時  |
| 連続失敗回数   | 連続で失敗している回数    |

**操作：**

- 「今すぐPing」ボタン（動作確認用）
- プロジェクト編集画面への遷移
- プロジェクト削除

---

### 4.2 プロジェクト登録／編集画面

**入力項目：**

| 項目           | 必須 | 説明                                        |
| -------------- | ---- | ------------------------------------------- |
| プロジェクト名 | ○    | 表示用の名前                                |
| keep-alive URL | ○    | `https://your-app.vercel.app/api/keepalive` |
| Token          | ○    | 認証用トークン（自動生成可）                |
| 有効／無効     | -    | Pingを実行するかどうか                      |
| メモ           | -    | 用途、アカウント情報など                    |

**Token について：**

- 登録時に自動生成するオプションを提供
- URL漏洩対策としてマスク表示

---

### 4.3 Pingログ画面（簡易）

**表示内容：**

| 項目             | 説明               |
| ---------------- | ------------------ |
| 実行日時         | Pingを実行した日時 |
| 成否             | ✅ 成功 / ❌ 失敗  |
| HTTPステータス   | 200, 500 など      |
| レイテンシ       | 応答時間（ms）     |
| エラーメッセージ | 失敗時のエラー内容 |

---

## 5. データベース設計（中央Supabase）

### 5.1 projects テーブル

| カラム名             | 型          | 説明                               |
| -------------------- | ----------- | ---------------------------------- |
| id                   | uuid        | PK, デフォルト: gen_random_uuid()  |
| user_id              | uuid        | ユーザーID（auth.users.id）        |
| name                 | text        | 表示名                             |
| keepalive_url        | text        | keep-aliveエンドポイントURL        |
| token                | text        | 認証用トークン                     |
| is_enabled           | boolean     | 有効フラグ, デフォルト: true       |
| last_ping_at         | timestamptz | 最終Ping時刻                       |
| last_success_at      | timestamptz | 最終成功時刻                       |
| consecutive_failures | int         | 連続失敗回数, デフォルト: 0        |
| status               | text        | ok / warn / down, デフォルト: 'ok' |
| notes                | text        | メモ                               |
| created_at           | timestamptz | 作成日時                           |
| updated_at           | timestamptz | 更新日時                           |

---

### 5.2 ping_logs テーブル

| カラム名      | 型          | 説明               |
| ------------- | ----------- | ------------------ |
| id            | uuid        | PK                 |
| project_id    | uuid        | FK → projects.id   |
| pinged_at     | timestamptz | 実行日時           |
| is_success    | boolean     | 成功可否           |
| http_status   | int         | HTTPステータス     |
| latency_ms    | int         | 応答時間（ミリ秒） |
| error_message | text        | エラー内容         |
| created_at    | timestamptz | 作成日時           |

---

## 6. ステータス判定ロジック

| ステータス  | 条件                                 |
| ----------- | ------------------------------------ |
| 🟢 **ok**   | 直近Pingで成功、かつ連続失敗 < 2     |
| 🟡 **warn** | 連続失敗 >= 2                        |
| 🔴 **down** | 連続失敗 >= 5、または3日以上成功なし |

---

## 7. keep-alive エンドポイント仕様（各プロジェクト側）

### 7.1 エンドポイント

```
GET /api/keepalive?token=XXXX
```

### 7.2 処理内容

1. クエリパラメータの `token` を検証
2. Supabase DBへ軽量なクエリを実行（活動として認識させる）
3. `200 OK` + JSON を返却

### 7.3 推奨実装（Next.js App Router）

各プロジェクトに以下のファイルを追加する。

**ファイル：** `app/api/keepalive/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Token検証
  const token = request.nextUrl.searchParams.get('token');
  if (token !== process.env.KEEPALIVE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Supabaseクライアント作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 3. heartbeatテーブルにupsert（活動を発生させる）
  const { error } = await supabase.from('heartbeat').upsert({
    id: 1,
    last_ping: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4. 成功レスポンス
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
}
```

**環境変数：**

```
KEEPALIVE_TOKEN=your-secret-token-here
```

**heartbeat テーブル（各プロジェクトのSupabaseに作成）：**

```sql
CREATE TABLE heartbeat (
  id int PRIMARY KEY,
  last_ping timestamptz
);
```

---

## 8. Cron実行仕様

### 8.1 実行方法

**GitHub Actions** を使用（1日1回実行）

### 8.2 処理フロー

```
1. GitHub Actions が中央DashboardのCron用APIを呼び出す
2. 有効な全プロジェクトを取得
3. 各プロジェクトの keep-alive URL に並列でfetch
4. 結果を ping_logs に保存
5. projects の状態（status, consecutive_failures等）を更新
```

### 8.3 GitHub Actions 設定例

**ファイル：** `.github/workflows/keepalive-cron.yml`

```yaml
name: Supabase Keeper Daily Ping

on:
  schedule:
    # 毎日 AM 9:00 (JST) = UTC 0:00
    - cron: '0 0 * * *'
  workflow_dispatch: # 手動実行も可能

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger keep-alive
        run: |
          curl -X POST "${{ secrets.KEEPER_CRON_URL }}" \
            -H "Authorization: Bearer ${{ secrets.KEEPER_CRON_SECRET }}"
```

---

## 9. 認証・セキュリティ

### 9.1 中央Dashboard

| 項目         | MVP                   | 将来                  |
| ------------ | --------------------- | --------------------- |
| 認証方式     | Supabase Auth         | Supabase Auth         |
| 対象ユーザー | 自分のみ              | 一般ユーザー登録可    |
| RLS          | 有効（user_idで制限） | 有効（user_idで制限） |

### 9.2 keep-alive API（各プロジェクト）

- `token` パラメータによる簡易認証
- tokenは各プロジェクトの環境変数で管理
- 中央DashboardにはURL+tokenのみ保存（Supabase認証情報は預からない）

### 9.3 Cron API（中央Dashboard）

- `Authorization: Bearer` ヘッダーで認証
- secretはGitHub Actionsのsecretsで管理

---

## 10. 中央Dashboard自己ping機能

中央Dashboard自体もSupabase無料プランで運用するため、**自分自身もpause防止対象に含める**。

**実装方法：**

- 中央Dashboardにも `/api/keepalive` を設置
- `projects` テーブルに自分自身を登録
- 他のプロジェクトと同じ仕組みでpingされる

---

## 11. 技術スタック

| レイヤー       | 技術                  |
| -------------- | --------------------- |
| フロントエンド | Next.js (App Router)  |
| ホスティング   | Vercel                |
| データベース   | Supabase (PostgreSQL) |
| 認証           | Supabase Auth         |
| 定期実行       | GitHub Actions        |
| 言語           | TypeScript            |

---

## 12. MVP完了条件

以下がすべて満たされた時点でMVP完了とする：

- [ ] プロジェクト一覧で全プロジェクトの状態が把握できる
- [ ] プロジェクトの登録・編集・削除ができる
- [ ] 「今すぐPing」で動作確認ができる
- [ ] GitHub Actionsで毎日自動的にkeep-aliveが実行される
- [ ] 失敗時にステータスが warn → down と変化する
- [ ] 中央Dashboard自身もpause防止されている

---

## 13. 今後の拡張（参考）

- [ ] メール／Slack通知（連続失敗時）
- [ ] 一般ユーザー登録・ログイン機能
- [ ] プロジェクトグループ化
- [ ] Supabaseアカウント単位の整理
- [ ] Ping頻度のカスタマイズ（daily / weekly など）
- [ ] 他BaaS（Firebase、PlanetScale等）への拡張

---

## 付録：導入ガイド（各プロジェクト向け）

### 5分でできる！keep-aliveエンドポイント設置手順

**1. heartbeatテーブルを作成**

Supabaseの SQL Editor で実行：

```sql
CREATE TABLE heartbeat (
  id int PRIMARY KEY,
  last_ping timestamptz
);
```

**2. APIファイルを追加**

`app/api/keepalive/route.ts` を作成（内容は7.3参照）

**3. 環境変数を設定**

```
KEEPALIVE_TOKEN=（任意の文字列、推奨：32文字以上）
```

**4. Supabase Keeperに登録**

- URL: `https://your-app.vercel.app/api/keepalive`
- Token: 上記で設定した値

**以上で完了！**

---

_この仕様書は「自分の困りごとを最短で解消する」ことを最優先に設計されている。_
