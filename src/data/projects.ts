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
    featured?: boolean
    showOnProjects?: boolean
    showDetail?: boolean
}

export const projects: Project[] = [
    {
        id: 1,
        title: 'Marketframe',
        context: 'Projet personnel',
        shortDesc: "Comparer la rentabilité des objets vendus par certains PNJ de Warframe.",
        desc: "Marketframe est un outil pour Warframe. Il permet de comparer les objets vendus par certains PNJ et de voir rapidement lesquels sont les plus rentables à revendre au moment où l'outil est consulté. Le projet vient d'un besoin personnel, mais il s'adresse aussi aux nouveaux joueurs qui ne connaissent pas encore les prix.",
        stack: ['REST API', 'Spring Boot', 'Vue.js'],
        detailedStack: ['Java', 'Spring Boot', 'REST API', 'Vue.js', 'Git'],
        reasons: [
            "Partir d'un besoin personnel",
            "Comparer des données de marché",
            "Relier un back-end Java à une interface Vue",
        ],
        link: null,
        linkText: 'Prochainement',
    },
    {
        id: 2,
        title: 'SRT Engrave',
        context: 'Projet personnel',
        shortDesc: "Incruster des sous-titres dans les images d'une vidéo, sans fichier SRT séparé.",
        desc: "SRT Engrave est un outil desktop qui incruste les sous-titres dans les images d'une vidéo. Il vient d'un problème concret : ma télévision ne lisait pas les fichiers SRT, qu'ils soient séparés ou attachés à la vidéo. L'outil est volontairement simple, avec moins de fonctionnalités que les logiciels existants, pour rester accessible au plus grand nombre. Je l'ai écrit en Java pour travailler sur un projet concret et me familiariser avec le langage.",
        stack: ['Java', 'JavaFX'],
        detailedStack: ['Java', 'JavaFX', 'Traitement d’images', 'Git'],
        reasons: [
            "Résoudre un problème rencontré chez moi",
            "Faire un outil simple et accessible",
            "M'entraîner en Java sur un projet concret",
        ],
        link: null,
        linkText: 'Prochainement',
    },
    {
        id: 3,
        title: 'Kasa',
        context: 'Formation OpenClassrooms — Web Developer',
        shortDesc: "Application de location immobilière construite avec React.",
        desc: "Projet de formation : parcourir des annonces, ouvrir une fiche logement et naviguer dans une interface React. L'exercice porte sur la composition de composants, le routage et l'exploitation de données d'annonces.",
        stack: ['React', 'React Router', 'JavaScript', 'Sass'],
        detailedStack: ['React', 'React Router', 'JavaScript', 'Sass', 'Git'],
        reasons: [
            "Découvrir React et la logique de composants",
            "Gérer la navigation et l'affichage d'annonces",
            "Structurer une interface responsive",
        ],
        link: null,
        linkText: 'Projet de formation',
    },
    {
        id: 4,
        title: 'Mon Vieux Grimoire',
        context: 'Formation OpenClassrooms — Web Developer',
        shortDesc: "API de notation de livres avec authentification.",
        desc: "Projet de formation : back-end Node/Express connecté à MongoDB, avec authentification, upload d'images et notation d'ouvrages. Le travail porte sur la validation, les droits d'accès et la conception d'une API REST.",
        stack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
        detailedStack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Multer', 'REST API', 'Git'],
        reasons: [
            "Construire une API REST complète",
            "Gérer l'authentification et les droits",
            "Travailler la validation et les uploads",
        ],
        link: null,
        linkText: 'Projet de formation',
    },
]
