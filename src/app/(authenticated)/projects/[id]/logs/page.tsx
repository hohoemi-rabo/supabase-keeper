import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPingLogs } from '@/app/actions/ping-logs'
import { LogTable } from './_components/log-table'
import { Pagination } from './_components/pagination'

export default async function PingLogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const { logs, totalCount, projectName, pageSize, error } = await getPingLogs(id, page)

  if (error === 'Project not found') {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Dashboard
          </Link>
          <h2 className="text-xl font-semibold text-gray-900 mt-1">
            Ping logs: {projectName}
          </h2>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          Failed to load logs: {error}
        </div>
      ) : (
        <>
          <LogTable logs={logs} />
          <Pagination
            projectId={id}
            currentPage={page}
            totalCount={totalCount}
            pageSize={pageSize ?? 20}
          />
        </>
      )}
    </div>
  )
}
