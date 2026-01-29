import Link from 'next/link'
import { getProjects } from '@/app/actions/projects'
import { ProjectList } from './_components/project-list'

export default async function DashboardPage() {
  const { projects, error } = await getProjects()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Add project
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          Failed to load projects: {error}
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  )
}
