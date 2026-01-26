# 003: プロジェクト一覧画面（Dashboard）

## 概要

登録済みの全プロジェクトの状態を一覧表示するダッシュボード画面を実装する。

## 関連セクション

- REQUIREMENTS.md: 4.1 プロジェクト一覧画面

## 表示項目

| 項目 | 説明 |
|------|------|
| プロジェクト名 | 任意の表示名 |
| ステータス | 🟢 OK / 🟡 WARN / 🔴 DOWN |
| 最終Ping時刻 | 最後にPingを実行した日時 |
| 最終成功時刻 | 最後にPingが成功した日時 |
| 連続失敗回数 | 連続で失敗している回数 |

## 操作

- 「今すぐPing」ボタン
- プロジェクト編集画面への遷移
- プロジェクト削除

## タスク

### 画面実装

- [ ] `app/(authenticated)/dashboard/page.tsx` 作成
- [ ] プロジェクト一覧取得のServer Action作成
- [ ] プロジェクトカード/行コンポーネント作成

### ステータス表示

- [ ] ステータスバッジコンポーネント作成
- [ ] ステータスに応じた色分け実装
  - ok: 緑
  - warn: 黄
  - down: 赤

### 「今すぐPing」機能

- [ ] Ping実行のServer Action作成
- [ ] ボタンコンポーネント作成（ローディング状態含む）
- [ ] Ping結果の即時反映

### 削除機能

- [ ] 削除確認ダイアログ
- [ ] 削除のServer Action作成
- [ ] 削除後の一覧更新

### UI/UX

- [ ] 空状態の表示（プロジェクト未登録時）
- [ ] ローディング状態の表示
- [ ] エラー状態の表示

## コンポーネント構成

```
src/
  app/
    (authenticated)/
      dashboard/
        page.tsx
        _components/
          project-list.tsx
          project-card.tsx
          status-badge.tsx
          ping-button.tsx
          delete-button.tsx
  actions/
    projects.ts
```

## 完了条件

- [ ] プロジェクト一覧が表示される
- [ ] ステータスが色分けされて表示される
- [ ] 「今すぐPing」でPingが実行され結果が反映される
- [ ] プロジェクト削除が機能する
- [ ] 編集画面へ遷移できる
