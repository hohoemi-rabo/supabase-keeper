import Link from 'next/link'
import type { Tables } from '@/types/database'
import { ProjectCard } from './project-card'

export function ProjectList({ projects }: { projects: Tables<'projects'>[] }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 mb-4">No projects registered yet.</p>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Add your first project
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
