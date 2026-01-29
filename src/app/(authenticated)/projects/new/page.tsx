import Link from 'next/link'
import { ProjectForm } from '../_components/project-form'

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Dashboard
        </Link>
        <h2 className="text-xl font-bold text-gray-900 mt-1">Add project</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
