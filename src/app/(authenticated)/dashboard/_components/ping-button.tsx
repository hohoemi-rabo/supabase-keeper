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
        className="text-sm px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPinging ? 'Pinging...' : 'Ping'}
      </button>
      {result && (
        <span className={`text-xs ${result.startsWith('OK') ? 'text-green-600' : 'text-red-600'}`}>
          {result}
        </span>
      )}
    </div>
  )
}
