export interface ProjectPayload {
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

export interface VitrinePayload {
  title: string
  description: string
  image: string | null
  link: string | null
  linkText: string
  sortOrder: number
  published: boolean
}
