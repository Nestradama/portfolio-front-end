export interface Vitrine {
    id: number
    title: string
    desc: string
    img: string
    link: string | null
    linkText: string
}

export const vitrines: Vitrine[] = [
    {
        id: 1,
        title: "Template site Graphiste",
        desc: "Une template destinée aux artistes du visuel, pour une communication simple et directe.",
        img: "/assets/static/graphist_website_preview.webp",
        link: "/graph_showcase/",
        linkText: "Voir le Projet"
    },
    {
        id: 2,
        title: "Vitrine Restaurant",
        desc: "Site vitrine responsive pour restaurant : menu interactif et support multilingue.",
        img: "/assets/static/clv_preview.webp",
        link: "/clv/index.html",
        linkText: "Voir le Projet"
    }
];