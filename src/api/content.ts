import type { Project } from '@/data/projects'
import type { Vitrine } from '@/data/vitrine'

export interface ApiProject {
  id: number
  title: string
  context: string
  shortDescription: string
  description: string
  stack: string[]
  detailedStack: string[]
  reasons: string[]
  link: string | null
  linkText: string
  image: string | null
  sortOrder: number
  published: boolean
}

export interface ApiVitrine {
  id: number
  title: string
  description: string
  image: string | null
  link: string | null
  linkText: string
  sortOrder: number
  published: boolean
}

export interface ContentPayload {
  version: number
  updatedAt: string
  projects: ApiProject[]
  vitrines: ApiVitrine[]
}

function mapProject(project: ApiProject): Project {
  return {
    id: project.id,
    title: project.title,
    context: project.context,
    shortDesc: project.shortDescription,
    desc: project.description,
    stack: project.stack,
    detailedStack: project.detailedStack,
    reasons: project.reasons,
    link: project.link,
    linkText: project.linkText,
  }
}

function mapVitrine(vitrine: ApiVitrine): Vitrine {
  return {
    id: vitrine.id,
    title: vitrine.title,
    desc: vitrine.description,
    img: vitrine.image ?? '',
    link: vitrine.link,
    linkText: vitrine.linkText,
  }
}

export async function fetchContent(): Promise<{
  projects: Project[]
  vitrines: Vitrine[]
  version: number
}> {
  const response = await fetch('/api/content', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Content API returned ${response.status}`)
  }

  const payload = (await response.json()) as ContentPayload

  return {
    projects: payload.projects.map(mapProject),
    vitrines: payload.vitrines.map(mapVitrine),
    version: payload.version,
  }
}
