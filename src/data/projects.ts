export interface Project {
    id: number
    title: string
    context: string
    shortDesc: string
    desc: string
    tags?: string[]
    displayMode?: 'card' | 'detailed' | 'detailed-preview'
    detailImage?: string | null
    stack: string[]
    detailedStack: string[]
    reasons: string[]
    link: string | null
    linkText: string
    image?: string | null
    github?: string | null
    featured?: boolean
    showOnProjects?: boolean
    showDetail?: boolean
    showGithub?: boolean
}
