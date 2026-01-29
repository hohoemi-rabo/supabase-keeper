# 004: プロジェクト登録/編集画面

## 概要

新規プロジェクトの登録および既存プロジェクトの編集機能を実装する。

## 関連セクション

- REQUIREMENTS.md: 4.2 プロジェクト登録/編集画面

## 入力項目

| 項目 | 必須 | 説明 |
|------|------|------|
| プロジェクト名 | ○ | 表示用の名前（max 100文字） |
| keep-alive URL | ○ | `https://your-app.vercel.app/api/keepalive` |
| Token | ○ | 認証用トークン（min 8文字、自動生成可） |
| 有効/無効 | - | Pingを実行するかどうか（チェックボックス） |
| メモ | - | 用途、アカウント情報など |

## タスク

### Server Actions

- [x] `getProject` - 単体取得
- [x] `createProject` - 新規作成（バリデーション付き）
- [x] `updateProject` - 更新（バリデーション付き）
- [x] `validateProjectForm` - 共通バリデーション

### Token機能

- [x] `generate-token.ts` - crypto.getRandomValuesで32文字生成
- [x] `token-field.tsx` - マスク表示/Show・Hide切替/Generate/Copy

### フォーム

- [x] `project-form.tsx` - 新規・編集共通フォーム（useActionState）

### ページ

- [x] `projects/new/page.tsx` - 新規登録ページ
- [x] `projects/[id]/edit/page.tsx` - 編集ページ（既存データ読み込み）

## コンポーネント構成

```
src/
  lib/
    utils/
      generate-token.ts
  app/
    actions/
      projects.ts                       # getProject, createProject, updateProject 追加
    (authenticated)/
      projects/
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
        _components/
          project-form.tsx              # 共通フォーム
          token-field.tsx               # Token入力（マスク/生成/コピー）
```

## 完了条件

- [x] 新規プロジェクトを登録できる
- [x] 既存プロジェクトを編集できる
- [x] Tokenが自動生成できる
- [x] Tokenがマスク表示される
- [x] バリデーションエラーが表示される
- [x] 登録/更新後にダッシュボードへリダイレクトされる
