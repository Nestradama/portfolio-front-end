export interface Project {
    id: number
    title: string
    desc: string
    stack: string[]
    link: string | null
    linkText: string
}

export const projects: Project[] = [
    {
        id: 1,
        title: 'Marketframe',
        desc: "Application pour analyser la rentabilité des mods des PNJ de Warframe sur le marché",
        stack: ['RestAPI', 'Springboot', 'VueJS'],
        link: null,
        linkText: 'Prochainement',
    },
    {
        id: 2,
        title: 'SRT Engrave',
        desc: 'Logiciel pour écrire les sous-titres directement sur les images de la vidéo, plutôt que via un fichier SRT lié',
        stack: ['Java', 'JavaFX'],
        link: null,
        linkText: 'Prochainement',
    },
    {
        id: 3,
        title: 'En cours',
        desc: 'Le site est en cours de construction, venez voir prochainement',
        stack: ['La', 'Patience', 'Est', 'une', 'Vertue'],
        link: null,
        linkText: 'Prochainement',
    },
]