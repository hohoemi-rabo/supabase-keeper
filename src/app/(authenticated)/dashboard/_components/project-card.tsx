import Link from 'next/link'
import type { Tables } from '@/types/database'
import { StatusBadge } from './status-badge'
import { PingButton } from './ping-button'
import { DeleteButton } from './delete-button'

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
}

const borderColor: Record<string, string> = {
  ok: 'border-l-emerald-500',
  warn: 'border-l-amber-500',
  down: 'border-l-red-500',
}

export function ProjectCard({ project }: { project: Tables<'projects'> }) {
  const accent = borderColor[project.status ?? 'ok'] ?? borderColor.ok

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 ${accent} hover:shadow-md transition-shadow`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <StatusBadge status={project.status} />
          </div>
          {!project.is_enabled && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">disabled</span>
          )}
        </div>

        <p className="text-xs text-gray-400 font-mono truncate mb-4">{project.keepalive_url}</p>

        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-slate-50 rounded-lg py-2 px-1">
            <p className="text-xs text-gray-500">Last Ping</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{formatDate(project.last_ping_at)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg py-2 px-1">
            <p className="text-xs text-gray-500">Last OK</p>
            <p className="text-xs font-medium text-gray-700 mt-0.5">{formatDate(project.last_success_at)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg py-2 px-1">
            <p className="text-xs text-gray-500">Failures</p>
            <p className={`text-sm font-bold mt-0.5 ${(project.consecutive_failures ?? 0) > 0 ? 'text-red-600' : 'text-gray-700'}`}>
              {project.consecutive_failures ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <PingButton projectId={project.id} />
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}/logs`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Logs
          </Link>
          <Link
            href={`/projects/${project.id}/edit`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Edit
          </Link>
          <DeleteButton projectId={project.id} projectName={project.name} />
        </div>
      </div>
    </div>
  )
}
