# 002: 認証機能セットアップ

## 概要

Supabase Authを使用した認証機能を実装する。MVPでは自分専用のため、Email/Password認証のみ。

## 関連セクション

- REQUIREMENTS.md: 9.1 中央Dashboard認証

## タスク

### Supabase Auth設定

- [x] Supabase Dashboardで認証プロバイダー設定確認
- [x] Email認証が有効になっていることを確認

### Supabaseクライアント設定

- [x] `@supabase/supabase-js`をインストール
- [x] `@supabase/ssr`をインストール
- [x] `src/lib/supabase/client.ts` 作成（ブラウザ用）
- [x] `src/lib/supabase/server.ts` 作成（Server Component用）
- [x] `src/lib/supabase/middleware.ts` 作成（Middleware用）
- [x] `src/lib/supabase/admin.ts` 作成（Service Role用）

### Middleware実装

- [x] `middleware.ts`をプロジェクトルートに作成
- [x] 認証が必要なルートを保護（/login, /auth, /api 以外）
- [x] セッションリフレッシュ処理を実装
- [x] 認証済みユーザーの/loginアクセス時にダッシュボードへリダイレクト

### 認証画面

- [x] ログインページ（`app/login/page.tsx`）作成
- [x] useActionStateによるフォーム状態管理
- [x] ログアウト機能実装（Server Action）

### 認証状態管理

- [x] Auth Callbackルート（`app/auth/callback/route.ts`）作成
- [x] 未認証時のリダイレクト処理（Middleware + Layout二重チェック）
- [x] ルートページ（/）からダッシュボードへリダイレクト

## ファイル構成

```
src/
  app/
    page.tsx                        # / → /dashboard リダイレクト
    login/
      page.tsx                      # ログインフォーム
    auth/
      callback/
        route.ts                    # OAuth callback
    actions/
      auth.ts                       # login / logout Server Actions
    (authenticated)/
      layout.tsx                    # 認証チェック + ヘッダー + ログアウト
      dashboard/
        page.tsx                    # ダッシュボード（仮）
  lib/
    supabase/
      client.ts                     # ブラウザ用
      server.ts                     # Server Component用
      middleware.ts                 # Middleware用
      admin.ts                      # Service Role用
middleware.ts                       # ルート保護
```

## 完了条件

- [x] ログイン/ログアウトが機能する
- [x] 未認証ユーザーは保護されたページにアクセスできない
- [x] セッションが正しくリフレッシュされる
