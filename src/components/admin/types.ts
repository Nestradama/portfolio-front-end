export interface ProjectPayload {
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

export interface VitrinePayload {
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
