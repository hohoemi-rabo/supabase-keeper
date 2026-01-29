import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  // Bearer Token認証
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token || token !== process.env.KEEPER_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // 有効な全プロジェクトを取得
  const { data: projects, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('is_enabled', true)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!projects || projects.length === 0) {
    return NextResponse.json({
      success: true,
      results: { total: 0, succeeded: 0, failed: 0 },
      details: [],
    })
  }

  // 全プロジェクトに並列でPing
  const details = await Promise.all(
    projects.map(async (project) => {
      const startTime = Date.now()
      let isSuccess = false
      let httpStatus: number | null = null
      let errorMessage: string | null = null

      try {
        const url = new URL(project.keepalive_url)
        url.searchParams.set('token', project.token)

        const res = await fetch(url.toString(), {
          method: 'GET',
          signal: AbortSignal.timeout(10000),
        })

        httpStatus = res.status
        isSuccess = res.ok
        if (!res.ok) {
          errorMessage = `HTTP ${res.status}`
        }
      } catch (e) {
        errorMessage = e instanceof Error ? e.message : 'Unknown error'
      }

      const latencyMs = Date.now() - startTime
      const now = new Date().toISOString()

      // ログ保存
      await supabase.from('ping_logs').insert({
        project_id: project.id,
        is_success: isSuccess,
        http_status: httpStatus,
        latency_ms: latencyMs,
        error_message: errorMessage,
      })

      // ステータス更新
      const newConsecutiveFailures = isSuccess
        ? 0
        : (project.consecutive_failures ?? 0) + 1

      let newStatus: string
      if (isSuccess && newConsecutiveFailures < 2) {
        newStatus = 'ok'
      } else if (newConsecutiveFailures >= 5) {
        newStatus = 'down'
      } else if (newConsecutiveFailures >= 2) {
        newStatus = 'warn'
      } else {
        newStatus = 'ok'
      }

      // 3日以上成功なしの場合もdown
      if (!isSuccess && project.last_success_at) {
        const daysSinceSuccess =
          (Date.now() - new Date(project.last_success_at).getTime()) /
          (1000 * 60 * 60 * 24)
        if (daysSinceSuccess >= 3) {
          newStatus = 'down'
        }
      }

      await supabase
        .from('projects')
        .update({
          last_ping_at: now,
          ...(isSuccess && { last_success_at: now }),
          consecutive_failures: newConsecutiveFailures,
          status: newStatus,
        })
        .eq('id', project.id)

      return {
        projectId: project.id,
        projectName: project.name,
        success: isSuccess,
        ...(httpStatus !== null && { status: httpStatus }),
        ...(latencyMs !== null && { latencyMs }),
        ...(errorMessage && { error: errorMessage }),
      }
    })
  )

  const succeeded = details.filter((d) => d.success).length
  const failed = details.filter((d) => !d.success).length

  return NextResponse.json({
    success: true,
    results: { total: details.length, succeeded, failed },
    details,
  })
}
