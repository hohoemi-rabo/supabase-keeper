# 005: Pingログ画面

## 概要

各プロジェクトのPing実行履歴を表示する画面を実装する。

## 関連セクション

- REQUIREMENTS.md: 4.3 Pingログ画面

## 表示項目

| 項目 | 説明 |
|------|------|
| 実行日時 | Pingを実行した日時（秒まで表示） |
| 成否 | Success（緑） / Failed（赤） |
| HTTPステータス | 200, 500 など（色分けバッジ） |
| レイテンシ | 応答時間（緑<500ms, 黄<2000ms, 赤>=2000ms） |
| エラーメッセージ | 失敗時のエラー内容（truncate表示） |

## タスク

### Server Action

- [x] `getPingLogs` - ページネーション付きログ取得（20件/ページ）

### 画面・コンポーネント

- [x] `projects/[id]/logs/page.tsx` - ログ一覧ページ
- [x] `_components/log-table.tsx` - テーブル表示（成否/ステータス/レイテンシ色分け）
- [x] `_components/pagination.tsx` - Previous/Next ページネーション

### UI/UX

- [x] 空状態の表示（「No ping logs yet.」）
- [x] エラー状態の表示
- [x] ダッシュボードへの戻るリンク
- [x] プロジェクトカードから「Logs」リンク追加

## コンポーネント構成

```
src/
  app/
    actions/
      ping-logs.ts                          # getPingLogs
    (authenticated)/
      projects/
        [id]/
          logs/
            page.tsx                        # ログ一覧ページ
            _components/
              log-table.tsx                 # テーブル + 成否/ステータス/レイテンシ
              pagination.tsx                # ページネーション
      dashboard/
        _components/
          project-card.tsx                  # 「Logs」リンク追加
```

## 完了条件

- [x] Pingログ一覧が表示される
- [x] 成否が視覚的に分かる
- [x] HTTPステータスが表示される
- [x] レイテンシが表示される
- [x] エラーメッセージが表示される
- [x] ページネーションが機能する
