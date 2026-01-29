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

export function ProjectCard({ project }: { project: Tables<'projects'> }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>
        {!project.is_enabled && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">disabled</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 mb-4">
        <div>
          <span className="text-gray-500">Last ping:</span>{' '}
          {formatDate(project.last_ping_at)}
        </div>
        <div>
          <span className="text-gray-500">Last success:</span>{' '}
          {formatDate(project.last_success_at)}
        </div>
        <div>
          <span className="text-gray-500">Failures:</span>{' '}
          {project.consecutive_failures ?? 0}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <PingButton projectId={project.id} />
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}/logs`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logs
          </Link>
          <Link
            href={`/projects/${project.id}/edit`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Edit
          </Link>
          <DeleteButton projectId={project.id} projectName={project.name} />
        </div>
      </div>
    </div>
  )
}
