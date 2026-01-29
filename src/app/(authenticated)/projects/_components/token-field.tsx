'use client'

import { useState } from 'react'
import { generateToken } from '@/lib/utils/generate-token'

export function TokenField({
  defaultValue,
  error,
}: {
  defaultValue?: string
  error?: string
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    const token = generateToken()
    setValue(token)
    setVisible(true)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <label htmlFor="token" className="block text-sm font-medium text-gray-800">
        Token <span className="text-red-500">*</span>
      </label>
      <div className="mt-1 flex gap-2">
        <div className="relative flex-1">
          <input
            id="token"
            name="token"
            type={visible ? 'text' : 'password'}
            required
            minLength={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Generate
        </button>
        {value && (
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
