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
      ? 'text-emerald-700'
      : ms < 2000
        ? 'text-amber-700'
        : 'text-red-700'
  return <span className={`font-mono text-sm ${color}`}>{ms}ms</span>
}

function StatusCode({ code }: { code: number | null }) {
  if (code === null) return <span className="text-gray-400">-</span>
  const color =
    code >= 200 && code < 300
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
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
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <p className="text-gray-500">No ping logs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Result
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Latency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Error
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap font-mono">
                  {formatDate(log.pinged_at)}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  {log.is_success ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Failed
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusCode code={log.http_status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <LatencyBadge ms={log.latency_ms} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
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
