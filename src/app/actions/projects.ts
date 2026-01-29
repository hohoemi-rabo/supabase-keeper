'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// --- バリデーション ---

type FormState = { message: string; errors?: Record<string, string> }

function validateProjectForm(formData: FormData) {
  const errors: Record<string, string> = {}
  const name = (formData.get('name') as string)?.trim()
  const keepaliveUrl = (formData.get('keepalive_url') as string)?.trim()
  const token = (formData.get('token') as string)?.trim()

  if (!name || name.length > 100) {
    errors.name = 'Project name is required (max 100 characters)'
  }

  if (!keepaliveUrl) {
    errors.keepalive_url = 'keep-alive URL is required'
  } else {
    try {
      new URL(keepaliveUrl)
    } catch {
      errors.keepalive_url = 'Invalid URL format'
    }
  }

  if (!token || token.length < 8) {
    errors.token = 'Token is required (min 8 characters)'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}

// --- 単体取得 ---

export async function getProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', project: null }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    return { error: error.message, project: null }
  }

  return { error: null, project: data }
}

// --- 作成 ---

export async function createProject(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { message: 'Unauthorized' }
  }

  const { errors, isValid } = validateProjectForm(formData)
  if (!isValid) {
    return { message: 'Validation failed', errors }
  }

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    name: (formData.get('name') as string).trim(),
    keepalive_url: (formData.get('keepalive_url') as string).trim(),
    token: (formData.get('token') as string).trim(),
    is_enabled: formData.get('is_enabled') === 'on',
    notes: (formData.get('notes') as string)?.trim() || null,
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// --- 更新 ---

export async function updateProject(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { message: 'Unauthorized' }
  }

  const projectId = formData.get('project_id') as string
  if (!projectId) {
    return { message: 'Project ID is required' }
  }

  const { errors, isValid } = validateProjectForm(formData)
  if (!isValid) {
    return { message: 'Validation failed', errors }
  }

  const { error } = await supabase
    .from('projects')
    .update({
      name: (formData.get('name') as string).trim(),
      keepalive_url: (formData.get('keepalive_url') as string).trim(),
      token: (formData.get('token') as string).trim(),
      is_enabled: formData.get('is_enabled') === 'on',
      notes: (formData.get('notes') as string)?.trim() || null,
    })
    .eq('id', projectId)

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// --- 一覧取得 ---

export async function getProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', projects: [] }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message, projects: [] }
  }

  return { error: null, projects: data }
}

export async function pingProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // プロジェクト取得
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    return { error: 'Project not found' }
  }

  // Ping実行
  const startTime = Date.now()
  let isSuccess = false
  let httpStatus: number | null = null
  let errorMessage: string | null = null

  try {
    const url = new URL(project.keepalive_url)
    url.searchParams.set('token', project.token)

    const res = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
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

  // ログ保存
  await supabase.from('ping_logs').insert({
    project_id: projectId,
    is_success: isSuccess,
    http_status: httpStatus,
    latency_ms: latencyMs,
    error_message: errorMessage,
  })

  // プロジェクト状態更新
  const newConsecutiveFailures = isSuccess ? 0 : (project.consecutive_failures ?? 0) + 1
  const now = new Date().toISOString()

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
    const daysSinceSuccess = (Date.now() - new Date(project.last_success_at).getTime()) / (1000 * 60 * 60 * 24)
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
    .eq('id', projectId)

  revalidatePath('/dashboard')

  return {
    error: null,
    result: { isSuccess, httpStatus, latencyMs, errorMessage },
  }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null }
}
