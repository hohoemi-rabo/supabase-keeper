'use client'

import { useState } from 'react'
import { deleteProject } from '@/app/actions/projects'

export function DeleteButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    await deleteProject(projectId)
    setIsDeleting(false)
    setIsConfirming(false)
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-700">Delete &quot;{projectName}&quot;?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="text-sm text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  )
}
