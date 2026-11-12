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
  github: string | null
  sortOrder: number
  published: boolean
  featured: boolean
  showOnProjects: boolean
  showDetail: boolean
  showGithub: boolean
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

export interface Content {
  projects: Project[]
  vitrines: Vitrine[]
  settings: SiteSettings
  version: number
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
    github: project.github,
    featured: project.featured,
    showOnProjects: project.showOnProjects,
    showDetail: project.showDetail,
    showGithub: project.showGithub,
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

function mapPayload(payload: ContentPayload): Content {
  if (
    !payload ||
    typeof payload !== 'object' ||
    !Array.isArray(payload.projects) ||
    !Array.isArray(payload.vitrines) ||
    typeof payload.settings !== 'object' ||
    payload.settings === null
  ) {
    throw new Error('Invalid content payload')
  }

  return {
    projects: payload.projects.map(mapProject),
    vitrines: payload.vitrines.map(mapVitrine),
    settings: payload.settings,
    version: typeof payload.version === 'number' ? payload.version : 0,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
  }
}

async function load(url: string, timeout: number): Promise<Content> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    // The live API should fail fast when it is down, so the static backup can take over.
    signal: AbortSignal.timeout(timeout),
  })

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`)
  }

  return mapPayload((await response.json()) as ContentPayload)
}

export function fetchContent(): Promise<Content> {
  return load('/api/content', 3000)
}

export function fetchBackup(): Promise<Content> {
  return load('/backup/content.json', 5000)
}
