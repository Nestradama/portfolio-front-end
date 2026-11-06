export interface StackGroup {
  title: string
  items: string[]
}

export interface PageSeo {
  title: string
  description: string
}

export interface SiteSettings {
  logo: string
  favicon: string
  home: {
    heading: string
    name: string
    paragraphs: string[]
    photo: string
  }
  about: {
    heading: string
    paragraphs: string[]
    photo: string
  }
  stack: {
    groups: StackGroup[]
  }
  contact: {
    email: string
    github: string
    linkedin: string
  }
  seo: {
    siteName: string
    defaultImage: string
    pages: {
      home: PageSeo
      about: PageSeo
      projects: PageSeo
    }
  }
  sections: {
    homeHero: boolean
    homeProjects: boolean
    homeVitrines: boolean
    homeFilters: boolean
    aboutIntro: boolean
    aboutStack: boolean
    aboutContact: boolean
    projectsList: boolean
    projectsVitrines: boolean
    projectsFilters: boolean
  }
}

export const defaultSettings: SiteSettings = {
  logo: '',
  favicon: '',
  home: {
    heading: "Salut, moi c'est Corentin.",
    name: '',
    paragraphs: [
      "Back-end de préférence, et pas mal de projets perso parce que c'est comme ça que j'apprends. Autodidacte, en formation webdev (OpenClassrooms), je vise une alternance Java.",
      "Si vous avez des projets qui ont besoin de solutions, n'hésitez pas à [me contacter](mailto:roquin.corentin@protonmail.com).",
    ],
    photo: '/assets/static/profile_picture.webp',
  },
  about: {
    heading: 'Parcours et objectif.',
    paragraphs: [
      "Je m'appelle Corentin. J'ai suivi un bac STI2D, puis j'ai appris le développement en autodidacte. Je suis aujourd'hui en formation webdev chez OpenClassrooms.",
      "Je travaille principalement sur le back-end. J'aime créer des outils, en particulier autour des API et des données.",
    ],
    photo: '/assets/static/profile_picture.webp',
  },
  stack: {
    groups: [
      { title: 'Front-end', items: ['HTML/CSS', 'JavaScript', 'Tailwind'] },
      { title: 'Back-end', items: ['Java', 'Python (Django, FastAPI)', 'Node.js'] },
      { title: 'Bases de données', items: ['PostgreSQL', 'Redis', 'Firebase'] },
      { title: 'Mobile', items: ['Flutter / Dart'] },
      { title: 'Autres', items: ['Git', 'OAuth'] },
    ],
  },
  contact: {
    email: 'roquin.corentin@protonmail.com',
    github: 'Nestradama',
    linkedin: 'https://www.linkedin.com/in/corentinrqn/',
  },
  seo: {
    siteName: 'Portfolio Corentin ROQUIN',
    defaultImage: '/assets/og-image-fr.png',
    pages: {
      home: {
        title: 'Corentin ROQUIN — Développeur back-end polyvalent',
        description:
          'Développeur back-end de préférence, polyvalent par nature : Java, Python et Node.js au service de solutions robustes et fonctionnelles.',
      },
      about: {
        title: 'À propos — Corentin ROQUIN',
        description:
          'Parcours, stack technique et contact de Corentin ROQUIN, développeur back-end.',
      },
      projects: {
        title: 'Projets — Corentin ROQUIN',
        description:
          'Projets personnels et réalisations de Corentin ROQUIN : Java, Python, Node.js et Vue.',
      },
    },
  },
  sections: {
    homeHero: true,
    homeProjects: true,
    homeVitrines: true,
    homeFilters: true,
    aboutIntro: true,
    aboutStack: true,
    aboutContact: true,
    projectsList: true,
    projectsVitrines: true,
    projectsFilters: true,
  },
}
