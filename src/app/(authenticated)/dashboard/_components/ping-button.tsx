'use client'

import { useState } from 'react'
import { pingProject } from '@/app/actions/projects'

export function PingButton({ projectId }: { projectId: string }) {
  const [isPinging, setIsPinging] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handlePing() {
    setIsPinging(true)
    setResult(null)

    const res = await pingProject(projectId)

    if (res.error) {
      setResult(`Error: ${res.error}`)
    } else if (res.result) {
      setResult(
        res.result.isSuccess
          ? `OK (${res.result.latencyMs}ms)`
          : `Failed: ${res.result.errorMessage}`
      )
    }

    setIsPinging(false)
    setTimeout(() => setResult(null), 3000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePing}
        disabled={isPinging}
        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
        </svg>
        {isPinging ? 'Pinging...' : 'Ping'}
      </button>
      {result && (
        <span className={`text-xs font-medium ${result.startsWith('OK') ? 'text-emerald-600' : 'text-red-600'}`}>
          {result}
        </span>
      )}
    </div>
  )
}
