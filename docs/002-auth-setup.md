# 002: 認証機能セットアップ

## 概要

Supabase Authを使用した認証機能を実装する。MVPでは自分専用のため、Email/Password認証のみ。

## 関連セクション

- REQUIREMENTS.md: 9.1 中央Dashboard認証

## タスク

### Supabase Auth設定

- [ ] Supabase Dashboardで認証プロバイダー設定確認
- [ ] Email認証が有効になっていることを確認

### Supabaseクライアント設定

- [ ] `@supabase/supabase-js`をインストール
- [ ] `@supabase/ssr`をインストール
- [ ] クライアント作成ユーティリティを実装

```
src/
  lib/
    supabase/
      client.ts      # ブラウザ用クライアント
      server.ts      # Server Component用クライアント
      middleware.ts  # Middleware用クライアント
```

- [ ] `src/lib/supabase/client.ts` 作成
- [ ] `src/lib/supabase/server.ts` 作成
- [ ] `src/lib/supabase/middleware.ts` 作成

### Middleware実装

- [ ] `middleware.ts`をプロジェクトルートに作成
- [ ] 認証が必要なルートを保護
- [ ] セッションリフレッシュ処理を実装

### 認証画面

- [ ] ログインページ（`app/login/page.tsx`）作成
- [ ] ログインフォームコンポーネント作成
- [ ] ログアウト機能実装

### 認証状態管理

- [ ] 認証状態をチェックするユーティリティ作成
- [ ] 未認証時のリダイレクト処理

## ファイル構成

```
src/
  app/
    login/
      page.tsx
    (authenticated)/    # 認証必須のルートグループ
      layout.tsx
      dashboard/
        page.tsx
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
middleware.ts
```

## 完了条件

- [ ] ログイン/ログアウトが機能する
- [ ] 未認証ユーザーは保護されたページにアクセスできない
- [ ] セッションが正しくリフレッシュされる
