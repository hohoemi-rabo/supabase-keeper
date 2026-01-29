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
      <h2 className="text-xl font-semibold mb-6">Edit project</h2>
      <ProjectForm project={project} />
    </div>
  )
}
