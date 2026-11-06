import type { Project } from '@/data/projects'
import type { SiteSettings } from '@/data/settings'
import type { Tag } from '@/data/tags'
import type { Vitrine } from '@/data/vitrine'

export interface ApiProject {
  id: number
  title: string
  context: string
  shortDescription: string
  description: string
  tags: string[]
  displayMode: 'card' | 'detailed' | 'detailed-preview'
  detailImage: string | null
  stack: string[]
  detailedStack: string[]
  reasons: string[]
  link: string | null
  linkText: string
  image: string | null
  sortOrder: number
  published: boolean
  featured: boolean
  showOnProjects: boolean
  showDetail: boolean
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
  featured: boolean
  showOnProjects: boolean
}

export interface ContentPayload {
  version: number
  updatedAt: string
  settings: SiteSettings
  projects: ApiProject[]
  vitrines: ApiVitrine[]
  tags: Tag[]
}

function mapProject(project: ApiProject): Project {
  return {
    id: project.id,
    title: project.title,
    context: project.context,
    shortDesc: project.shortDescription,
    desc: project.description,
    tags: project.tags,
    displayMode: project.displayMode,
    detailImage: project.detailImage,
    stack: project.stack,
    detailedStack: project.detailedStack,
    reasons: project.reasons,
    link: project.link,
    linkText: project.linkText,
    image: project.image,
    featured: project.featured,
    showOnProjects: project.showOnProjects,
    showDetail: project.showDetail,
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
    featured: vitrine.featured,
    showOnProjects: vitrine.showOnProjects,
  }
}

export async function fetchContent(): Promise<{
  projects: Project[]
  vitrines: Vitrine[]
  settings: SiteSettings
  version: number
  tags: Tag[]
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
    settings: payload.settings,
    version: payload.version,
    tags: payload.tags,
  }
}
