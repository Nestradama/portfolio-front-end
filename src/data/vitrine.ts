export interface Vitrine {
    id: number
    title: string
    desc: string
    img: string
    link: string | null
    linkText: string
    featured?: boolean
    showOnProjects?: boolean
}
