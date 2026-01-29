# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Supabase Keeper is a monitoring service that prevents Supabase free-tier projects from being paused due to inactivity (7-day pause policy). It provides a central dashboard to monitor multiple Supabase projects and automatically sends keep-alive pings via GitHub Actions.

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build with Turbopack
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Tech Stack

- **Framework**: Next.js 15.5 (App Router) with Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4
- **Database/Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Hosting**: Vercel
- **Scheduled Jobs**: GitHub Actions (daily cron)

## Architecture

### System Design

```
GitHub Actions (daily cron)
        │
        ▼
Central Dashboard (this app)
        │ parallel fetch
        ▼
Project A/B/C... (/api/keepalive endpoints)
```

The central dashboard:
1. Stores project metadata (URL, token, status) in its own Supabase instance
2. GitHub Actions triggers the dashboard's cron API daily
3. Dashboard fetches each project's `/api/keepalive` endpoint in parallel
4. Results are logged and project statuses are updated
5. Dashboard itself is also registered as a project to prevent self-pause

### Key Database Tables (Central Supabase)

- `projects`: Stores monitored project info (name, keepalive_url, token, status, consecutive_failures)
- `ping_logs`: History of ping attempts (success/failure, latency, HTTP status)

### Status Logic

- 🟢 `ok`: Recent ping succeeded, consecutive_failures < 2
- 🟡 `warn`: consecutive_failures >= 2
- 🔴 `down`: consecutive_failures >= 5 OR no success for 3+ days

## Path Aliases

`@/*` maps to `./src/*`

## Next.js 15 App Router Best Practices

### Server Components vs Client Components

- **デフォルトはServer Component**: `app/`ディレクトリ内のコンポーネントはデフォルトでServer Component
- **Client Componentの宣言**: ファイル先頭に`'use client'`ディレクティブを追加（インポートより前）
- **使い分け**:
  - Server Component: データフェッチ、DB直接アクセス、機密情報を扱う処理
  - Client Component: useState/useEffect、イベントハンドラ、ブラウザAPI使用時

```tsx
// Client Componentの例
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

### Data Fetching

Server Component内で直接`async/await`を使用してデータを取得:

```tsx
// cache オプション
// 'force-cache': 静的データ（デフォルト、getStaticProps相当）
// 'no-store': 動的データ（getServerSideProps相当）
// next: { revalidate: 秒数 }: ISR（増分静的再生成）

async function getData() {
  const res = await fetch('https://...', { cache: 'no-store' })
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.name}</div>
}
```

### Server Actions

フォーム処理やデータ変更には Server Actions を使用:

```tsx
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function createItem(formData: FormData) {
  const name = formData.get('name')
  // DB操作
  redirect('/items')
}
```

```tsx
// フォームでの使用（useActionState推奨）
'use client'

import { useActionState } from 'react'
import { createItem } from '@/app/actions'

export function Form() {
  const [state, formAction, pending] = useActionState(createItem, { message: '' })

  return (
    <form action={formAction}>
      <input name="name" required />
      <button disabled={pending}>{pending ? '送信中...' : '送信'}</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

### Route Handlers (API Routes)

`app/api/*/route.ts`でAPIエンドポイントを作成:

```tsx
// app/api/example/route.ts
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headersList = await headers()
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return NextResponse.json({ data: 'value' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body }, { status: 201 })
}
```

### Metadata (SEO)

```tsx
// app/layout.tsx または app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
}
```

### Layouts

ネストされたレイアウトで共通UIを共有:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      <main>{children}</main>
    </div>
  )
}
```

### Middleware

認証やリダイレクト処理:

```tsx
// middleware.ts (プロジェクトルート)
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: '/api/:path*',
}
```

### Dynamic APIs

`headers()`や`searchParams`を使用するとルートは動的になり、Full Route Cacheからオプトアウトされる。

## Ticket/Todo Management

開発タスクは `/docs` 配下のチケットファイルで管理する。

### チケットファイル一覧

| ファイル | 内容 |
|----------|------|
| 001-supabase-setup.md | Supabaseプロジェクト・DB設計 |
| 002-auth-setup.md | 認証機能セットアップ |
| 003-project-list.md | プロジェクト一覧画面 |
| 004-project-form.md | プロジェクト登録/編集画面 |
| 005-ping-logs.md | Pingログ画面 |
| 006-keepalive-api.md | keep-alive APIエンドポイント |
| 007-cron-api.md | Cron用APIエンドポイント |
| 008-github-actions.md | GitHub Actions設定 |
| 009-self-registration.md | 自己登録（Self-ping設定） |
| 010-deployment.md | デプロイ設定 |

### Todo記法

各チケットファイル内でTodoを管理する:

```markdown
- [ ] 未完了のタスク
- [x] 完了したタスク
```

**ルール:**
- タスク完了時は `- [ ]` を `- [x]` に変更する
- チケット内の「完了条件」セクションの全タスクが `[x]` になったらチケット完了

## Production

- **URL**: https://supabase-keeper-theta.vercel.app/
- **Supabase Project ID**: yqjyfmkebsbeaivkhbib
- **Supabase Region**: ap-northeast-1 (Tokyo)
- **Cron Schedule**: 毎日 AM 9:00 JST (GitHub Actions)

## App Routes

### Pages (Authenticated)

| Route | Description |
|-------|-------------|
| `/dashboard` | プロジェクト一覧（メイン画面） |
| `/projects/new` | プロジェクト新規登録 |
| `/projects/[id]/edit` | プロジェクト編集 |
| `/projects/[id]/logs` | Pingログ一覧 |
| `/manual` | プロジェクト登録マニュアル |

### API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/keepalive` | GET | 自己keep-alive用（token認証） |
| `/api/cron/ping` | POST | 全プロジェクト一括ping（Bearer認証） |

### Auth

| Route | Description |
|-------|-------------|
| `/login` | ログインページ |
| `/auth/callback` | OAuth callback |

## Environment Variables (Expected)

For the central dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `KEEPALIVE_TOKEN` (for self keep-alive)
- `KEEPER_CRON_SECRET` (for GitHub Actions auth)

For monitored projects:
- `KEEPALIVE_TOKEN` (simple auth for /api/keepalive endpoint)
