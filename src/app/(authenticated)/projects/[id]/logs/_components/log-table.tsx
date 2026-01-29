import type { Tables } from '@/types/database'

function formatDate(date: string) {
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
}

function LatencyBadge({ ms }: { ms: number | null }) {
  if (ms === null) return <span className="text-gray-400">-</span>
  const color =
    ms < 500
      ? 'text-green-700'
      : ms < 2000
        ? 'text-amber-700'
        : 'text-red-700'
  return <span className={`font-mono text-sm ${color}`}>{ms}ms</span>
}

function StatusCode({ code }: { code: number | null }) {
  if (code === null) return <span className="text-gray-400">-</span>
  const color =
    code >= 200 && code < 300
      ? 'bg-green-100 text-green-800 border-green-300'
      : code >= 400
        ? 'bg-red-100 text-red-800 border-red-300'
        : 'bg-gray-100 text-gray-800 border-gray-300'
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono border ${color}`}>
      {code}
    </span>
  )
}

export function LogTable({ logs }: { logs: Tables<'ping_logs'>[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600">No ping logs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Result
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Latency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Error
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {formatDate(log.pinged_at)}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  {log.is_success ? (
                    <span className="text-green-700 font-medium">Success</span>
                  ) : (
                    <span className="text-red-700 font-medium">Failed</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusCode code={log.http_status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <LatencyBadge ms={log.latency_ms} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {log.error_message || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
