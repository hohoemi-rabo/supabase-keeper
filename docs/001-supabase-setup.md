# 001: Supabaseプロジェクトセットアップ

## 概要

中央Dashboard用のSupabaseプロジェクトを作成し、データベーススキーマを構築する。

## 関連セクション

- REQUIREMENTS.md: 5. データベース設計

## タスク

### Supabaseプロジェクト作成

- [x] Supabaseで新規プロジェクトを作成
- [x] プロジェクトURLとAPIキーを取得
- [x] 環境変数ファイル（.env.local）を作成

### projectsテーブル作成

- [x] マイグレーションSQL作成・実行（RLS + Service Roleポリシー + updated_atトリガー含む）

### ping_logsテーブル作成

- [x] マイグレーションSQL作成・実行（インデックス + RLS + Service Roleポリシー含む）

### heartbeatテーブル作成（自己ping用）

- [x] マイグレーションSQL作成・実行（初期レコード + RLS含む）

### TypeScript型定義

- [x] Supabase MCPで型生成 → `src/types/database.ts`

### Supabaseクライアント

- [x] `src/lib/supabase/client.ts` - ブラウザ用（@supabase/ssr）
- [x] `src/lib/supabase/server.ts` - Server Component用（@supabase/ssr）
- [x] `src/lib/supabase/admin.ts` - Service Role用（@supabase/supabase-js）

## プロジェクト情報

- **Project ID**: `yqjyfmkebsbeaivkhbib`
- **URL**: `https://yqjyfmkebsbeaivkhbib.supabase.co`
- **Region**: ap-northeast-1 (東京)

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://yqjyfmkebsbeaivkhbib.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=（設定済み）
SUPABASE_SERVICE_ROLE_KEY=（要手動設定：Supabase Dashboard → Settings → API）
```

## 適用済みマイグレーション

1. `create_projects_table` - projects + RLS + Service Role + updated_atトリガー
2. `create_ping_logs_table` - ping_logs + インデックス + RLS + Service Role
3. `create_heartbeat_table` - heartbeat + 初期データ + RLS
4. `fix_function_search_path` - update_updated_at関数のsearch_path固定

## 完了条件

- [x] 全テーブルが作成されている
- [x] RLSポリシーが有効になっている
- [x] 環境変数が設定されている
- [x] TypeScript型定義が存在する
