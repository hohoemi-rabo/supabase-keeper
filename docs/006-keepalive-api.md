# 006: keep-alive APIエンドポイント

## 概要

中央Dashboard自身のkeep-alive用エンドポイントを実装する。他プロジェクトと同じ仕組みで自己pingされる。

## 関連セクション

- REQUIREMENTS.md: 7. keep-aliveエンドポイント仕様
- REQUIREMENTS.md: 10. 中央Dashboard自己ping機能

## エンドポイント仕様

```
GET /api/keepalive?token=XXXX
```

### 処理内容

1. クエリパラメータの `token` を検証
2. Supabase DBへ軽量なクエリを実行（heartbeatテーブル更新）
3. `200 OK` + JSON を返却

### レスポンス

成功時:
```json
{
  "ok": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

失敗時（認証エラー）:
```json
{
  "error": "Unauthorized"
}
```

失敗時（DB エラー）:
```json
{
  "error": "エラーメッセージ"
}
```

## タスク

### APIエンドポイント実装

- [ ] `app/api/keepalive/route.ts` 作成
- [ ] Token検証ロジック実装
- [ ] heartbeatテーブル更新処理
- [ ] エラーハンドリング

### 環境変数

- [ ] `KEEPALIVE_TOKEN` を `.env.local` に追加
- [ ] Vercel環境変数に設定

### テスト

- [ ] 正常系: 正しいTokenでリクエスト → 200
- [ ] 異常系: Tokenなし → 401
- [ ] 異常系: 不正なToken → 401

## 実装コード

```typescript
// app/api/keepalive/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== process.env.KEEPALIVE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('heartbeat').upsert({
    id: 1,
    last_ping: new Date().toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
  })
}
```

## 完了条件

- [ ] `/api/keepalive` が実装されている
- [ ] Token認証が機能する
- [ ] heartbeatテーブルが更新される
- [ ] 正しいレスポンスが返却される
