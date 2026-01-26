# 001: Supabaseプロジェクトセットアップ

## 概要

中央Dashboard用のSupabaseプロジェクトを作成し、データベーススキーマを構築する。

## 関連セクション

- REQUIREMENTS.md: 5. データベース設計

## タスク

### Supabaseプロジェクト作成

- [ ] Supabaseで新規プロジェクトを作成
- [ ] プロジェクトURLとAPIキーを取得
- [ ] 環境変数ファイル（.env.local）を作成

### projectsテーブル作成

- [ ] マイグレーションSQL作成

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  keepalive_url text NOT NULL,
  token text NOT NULL,
  is_enabled boolean DEFAULT true,
  last_ping_at timestamptz,
  last_success_at timestamptz,
  consecutive_failures int DEFAULT 0,
  status text DEFAULT 'ok' CHECK (status IN ('ok', 'warn', 'down')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSポリシー
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

- [ ] Supabaseでマイグレーション実行

### ping_logsテーブル作成

- [ ] マイグレーションSQL作成

```sql
CREATE TABLE ping_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pinged_at timestamptz NOT NULL DEFAULT now(),
  is_success boolean NOT NULL,
  http_status int,
  latency_ms int,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- インデックス
CREATE INDEX idx_ping_logs_project_id ON ping_logs(project_id);
CREATE INDEX idx_ping_logs_pinged_at ON ping_logs(pinged_at DESC);

-- RLSポリシー
ALTER TABLE ping_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own project logs"
  ON ping_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ping_logs.project_id
      AND projects.user_id = auth.uid()
    )
  );
```

- [ ] Supabaseでマイグレーション実行

### heartbeatテーブル作成（自己ping用）

- [ ] マイグレーションSQL作成

```sql
CREATE TABLE heartbeat (
  id int PRIMARY KEY,
  last_ping timestamptz
);

-- 初期レコード挿入
INSERT INTO heartbeat (id, last_ping) VALUES (1, now());
```

- [ ] Supabaseでマイグレーション実行

### TypeScript型定義

- [ ] Supabase CLIで型生成、または手動で型定義ファイル作成

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx
```

## 完了条件

- [ ] 全テーブルが作成されている
- [ ] RLSポリシーが有効になっている
- [ ] 環境変数が設定されている
- [ ] TypeScript型定義が存在する
