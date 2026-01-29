const statusConfig = {
  ok: { label: 'OK', className: 'bg-green-100 text-green-800' },
  warn: { label: 'WARN', className: 'bg-yellow-100 text-yellow-800' },
  down: { label: 'DOWN', className: 'bg-red-100 text-red-800' },
} as const

type Status = keyof typeof statusConfig

export function StatusBadge({ status }: { status: string | null }) {
  const config = statusConfig[(status as Status) ?? 'ok'] ?? statusConfig.ok

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
