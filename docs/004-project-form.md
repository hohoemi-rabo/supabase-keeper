# 004: プロジェクト登録/編集画面

## 概要

新規プロジェクトの登録および既存プロジェクトの編集機能を実装する。

## 関連セクション

- REQUIREMENTS.md: 4.2 プロジェクト登録/編集画面

## 入力項目

| 項目 | 必須 | 説明 |
|------|------|------|
| プロジェクト名 | ○ | 表示用の名前 |
| keep-alive URL | ○ | `https://your-app.vercel.app/api/keepalive` |
| Token | ○ | 認証用トークン（自動生成可） |
| 有効/無効 | - | Pingを実行するかどうか |
| メモ | - | 用途、アカウント情報など |

## タスク

### 新規登録画面

- [ ] `app/(authenticated)/projects/new/page.tsx` 作成
- [ ] プロジェクト登録フォームコンポーネント作成
- [ ] バリデーション実装
  - プロジェクト名: 必須、1-100文字
  - URL: 必須、有効なURL形式
  - Token: 必須、8文字以上

### 編集画面

- [ ] `app/(authenticated)/projects/[id]/edit/page.tsx` 作成
- [ ] 既存データの読み込み
- [ ] 更新のServer Action作成

### Token自動生成

- [ ] Token生成ユーティリティ作成（32文字のランダム文字列）
- [ ] 「自動生成」ボタン実装

### Token表示

- [ ] マスク表示（デフォルト）
- [ ] 表示/非表示トグル
- [ ] コピーボタン

### フォームコンポーネント

- [ ] 入力フィールドコンポーネント
- [ ] トグルスイッチ（有効/無効）
- [ ] テキストエリア（メモ）
- [ ] 送信ボタン（ローディング状態）

### Server Actions

- [ ] `createProject` アクション
- [ ] `updateProject` アクション
- [ ] 入力値のサニタイズ

## コンポーネント構成

```
src/
  app/
    (authenticated)/
      projects/
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
        _components/
          project-form.tsx
          token-field.tsx
  lib/
    utils/
      generate-token.ts
  actions/
    projects.ts
```

## 完了条件

- [ ] 新規プロジェクトを登録できる
- [ ] 既存プロジェクトを編集できる
- [ ] Tokenが自動生成できる
- [ ] Tokenがマスク表示される
- [ ] バリデーションエラーが表示される
- [ ] 登録/更新後にダッシュボードへリダイレクトされる
