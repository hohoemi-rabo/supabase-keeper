'use server'

import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 20

export async function getPingLogs(projectId: string, page: number = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', logs: [], totalCount: 0 }
  }

  // プロジェクトの存在と所有権を確認
  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .single()

  if (!project) {
    return { error: 'Project not found', logs: [], totalCount: 0 }
  }

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('ping_logs')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .order('pinged_at', { ascending: false })
    .range(from, to)

  if (error) {
    return { error: error.message, logs: [], totalCount: 0 }
  }

  return {
    error: null,
    logs: data,
    totalCount: count ?? 0,
    projectName: project.name,
    pageSize: PAGE_SIZE,
  }
}
