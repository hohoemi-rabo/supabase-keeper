const statusConfig = {
  ok: { label: 'OK', className: 'bg-emerald-100 text-emerald-800 border border-emerald-300', dot: 'bg-emerald-500' },
  warn: { label: 'WARN', className: 'bg-amber-100 text-amber-800 border border-amber-300', dot: 'bg-amber-500' },
  down: { label: 'DOWN', className: 'bg-red-100 text-red-800 border border-red-300', dot: 'bg-red-500' },
} as const

type Status = keyof typeof statusConfig

export function StatusBadge({ status }: { status: string | null }) {
  const config = statusConfig[(status as Status) ?? 'ok'] ?? statusConfig.ok
  const isOk = (status as Status) === 'ok' || status === null

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${isOk ? 'animate-pulse-dot' : ''}`}></span>
      {config.label}
    </span>
  )
}
