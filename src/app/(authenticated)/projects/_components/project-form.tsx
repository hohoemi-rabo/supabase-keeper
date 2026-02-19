'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createProject, updateProject } from '@/app/actions/projects'
import { TokenField } from './token-field'
import type { Tables } from '@/types/database'

type Props = {
  project?: Tables<'projects'>
}

export function ProjectForm({ project }: Props) {
  const isEdit = !!project
  const action = isEdit ? updateProject : createProject

  const [state, formAction, pending] = useActionState(action, { message: '' })

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {isEdit && <input type="hidden" name="project_id" value={project.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800">
          Project name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={project?.name ?? ''}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="keepalive_url" className="block text-sm font-medium text-gray-800">
          keep-alive URL <span className="text-red-500">*</span>
        </label>
        <input
          id="keepalive_url"
          name="keepalive_url"
          type="url"
          required
          placeholder="https://your-app.vercel.app/api/keepalive"
          defaultValue={project?.keepalive_url ?? ''}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
        />
        {state.errors?.keepalive_url && (
          <p className="mt-1 text-sm text-red-600">{state.errors.keepalive_url}</p>
        )}
      </div>

      <TokenField
        defaultValue={project?.token}
        error={state.errors?.token}
      />

      <details className="rounded-lg border border-gray-200 bg-gray-50">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-800 select-none">
          Supabase 直接Ping設定（任意）
        </summary>
        <div className="px-4 pb-4 space-y-4">
          <p className="text-xs text-gray-500">
            設定すると、Keeperが直接SupabaseのREST APIにリクエストを送り、プロジェクトの凍結を防止します。
          </p>
          <div>
            <label htmlFor="supabase_url" className="block text-sm font-medium text-gray-800">
              Supabase URL
            </label>
            <input
              id="supabase_url"
              name="supabase_url"
              type="url"
              placeholder="https://xxxxx.supabase.co"
              defaultValue={project?.supabase_url ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
            />
            {state.errors?.supabase_url && (
              <p className="mt-1 text-sm text-red-600">{state.errors.supabase_url}</p>
            )}
          </div>
          <div>
            <label htmlFor="supabase_anon_key" className="block text-sm font-medium text-gray-800">
              Supabase Anon Key
            </label>
            <input
              id="supabase_anon_key"
              name="supabase_anon_key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIs..."
              defaultValue={project?.supabase_anon_key ?? ''}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
            />
            {state.errors?.supabase_anon_key && (
              <p className="mt-1 text-sm text-red-600">{state.errors.supabase_anon_key}</p>
            )}
          </div>
        </div>
      </details>

      <div className="flex items-center gap-2">
        <input
          id="is_enabled"
          name="is_enabled"
          type="checkbox"
          defaultChecked={project?.is_enabled ?? true}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="is_enabled" className="text-sm text-gray-800">
          Enable keep-alive ping
        </label>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-800">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={project?.notes ?? ''}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2.5 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {state.message && !state.errors && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {pending ? 'Saving...' : isEdit ? 'Update project' : 'Create project'}
        </button>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
