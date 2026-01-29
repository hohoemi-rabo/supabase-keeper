# 003: プロジェクト一覧画面（Dashboard）

## 概要

登録済みの全プロジェクトの状態を一覧表示するダッシュボード画面を実装する。

## 関連セクション

- REQUIREMENTS.md: 4.1 プロジェクト一覧画面

## 表示項目

| 項目 | 説明 |
|------|------|
| プロジェクト名 | 任意の表示名 |
| ステータス | OK / WARN / DOWN |
| 最終Ping時刻 | 最後にPingを実行した日時 |
| 最終成功時刻 | 最後にPingが成功した日時 |
| 連続失敗回数 | 連続で失敗している回数 |

## 操作

- 「Ping」ボタン（即時実行、結果3秒表示）
- Edit リンク → プロジェクト編集画面
- Delete ボタン（インライン確認ダイアログ）

## タスク

### Server Actions

- [x] `getProjects` - プロジェクト一覧取得
- [x] `pingProject` - 手動Ping実行（ログ保存 + ステータス更新）
- [x] `deleteProject` - プロジェクト削除

### 画面・コンポーネント

- [x] `dashboard/page.tsx` - Server ComponentでgetProjectsを呼び出し
- [x] `_components/project-list.tsx` - 一覧表示 + 空状態
- [x] `_components/project-card.tsx` - プロジェクトカード
- [x] `_components/status-badge.tsx` - ステータスバッジ（ok/warn/down色分け）
- [x] `_components/ping-button.tsx` - Pingボタン（ローディング + 結果表示）
- [x] `_components/delete-button.tsx` - 削除ボタン（インライン確認）

### UI/UX

- [x] 空状態の表示（「Add your first project」リンク）
- [x] エラー状態の表示
- [x] 「Add project」ボタン → /projects/new

## コンポーネント構成

```
src/app/
  actions/
    projects.ts                         # getProjects, pingProject, deleteProject
  (authenticated)/
    dashboard/
      page.tsx                          # Server Component
      _components/
        project-list.tsx                # 一覧 + 空状態
        project-card.tsx                # カード（名前、ステータス、日時、操作）
        status-badge.tsx                # OK/WARN/DOWN バッジ
        ping-button.tsx                 # Client: Ping実行ボタン
        delete-button.tsx               # Client: 削除確認ボタン
```

## ステータス判定ロジック（pingProject内）

- 成功 → consecutive_failures = 0, status = 'ok'
- 失敗 → consecutive_failures++
  - >= 2: 'warn'
  - >= 5: 'down'
  - 3日以上成功なし: 'down'

## 完了条件

- [x] プロジェクト一覧が表示される
- [x] ステータスが色分けされて表示される
- [x] 「今すぐPing」でPingが実行され結果が反映される
- [x] プロジェクト削除が機能する
- [x] 編集画面へ遷移できる
