import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Corentin ROQUIN — Développeur back-end polyvalent',
            description: "Développeur back-end de préférence, polyvalent par nature : Java, Python et Node.js au service de solutions robustes et fonctionnelles.",
        },
    },
    {
        path: '/projets',
        name: 'projects',
        component: ProjectsView,
        meta: {
            title: 'Projets — Corentin ROQUIN',
            description: "Projets personnels et réalisations de Corentin ROQUIN : Java, Python, Node.js et Vue.",
        },
    },
    {
        path: '/a-propos',
        name: 'about',
        component: AboutView,
        meta: {
            title: 'À propos — Corentin ROQUIN',
            description: "Parcours, stack technique et contact de Corentin ROQUIN, développeur back-end.",
        },
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/AdminView.vue'),
        meta: {
            title: 'Administration — Corentin ROQUIN',
            description: 'Espace de gestion du portfolio.',
            robots: 'noindex, nofollow',
        },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

router.afterEach((to) => {
    const title = typeof to.meta.title === 'string' ? to.meta.title : 'Corentin ROQUIN'
    document.title = title

    const description = typeof to.meta.description === 'string' ? to.meta.description : ''
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
    }
    meta.content = description

    const robots = typeof to.meta.robots === 'string' ? to.meta.robots : 'index, follow'
    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.name = 'robots'
        document.head.appendChild(robotsMeta)
    }
    robotsMeta.content = robots
})

export default router
