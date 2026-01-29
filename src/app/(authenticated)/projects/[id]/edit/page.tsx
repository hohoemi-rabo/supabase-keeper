import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/app/actions/projects'
import { ProjectForm } from '../../_components/project-form'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { project, error } = await getProject(id)

  if (error || !project) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Dashboard
        </Link>
        <h2 className="text-xl font-bold text-gray-900 mt-1">Edit project</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
