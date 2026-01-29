import Link from 'next/link'

export function Pagination({
  projectId,
  currentPage,
  totalCount,
  pageSize,
}: {
  projectId: string
  currentPage: number
  totalCount: number
  pageSize: number
}) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-600">
        {totalCount} logs (page {currentPage} of {totalPages})
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={`/projects/${projectId}/logs?page=${currentPage - 1}`}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={`/projects/${projectId}/logs?page=${currentPage + 1}`}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}
