# Portfolio — Frontend

Interface publique et espace d’administration du portfolio de Corentin ROQUIN.

## Stack

- Vue 3 + TypeScript
- Vue Router
- Tailwind CSS 4
- Vite

## Démarrage

```bash
npm install
npm run dev
```

Le frontend tourne par défaut sur `http://localhost:5173`.

L’API doit être disponible sur `/api`. En développement, Vite la redirige vers `http://127.0.0.1:3000` par défaut. Pour utiliser une autre API :

```bash
VITE_API_PROXY=http://127.0.0.1:3200 npm run dev
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript + build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run type-check` | Vérification TypeScript seule |

Le build est généré dans `dist/`.

## Pages

| Route | Contenu |
|---|---|
| `/` | Accueil, projets mis en avant, réalisations |
| `/projets` | Liste détaillée, filtres par tags et réalisations |
| `/a-propos` | Parcours, stack et contact |
| `/admin` | Administration, protégée par l’API |

## Organisation

```text
src/
├── api/          appels HTTP et types de contenu
├── components/   composants publics et admin
├── composables/  état partagé, notamment useContent()
├── data/         types de contenu
├── router/       routes et métadonnées SEO
└── views/        pages publiques et admin
```

Le contenu est chargé depuis `/api/content`. Si l’API est indisponible, un message d’erreur s’affiche ; aucun contenu de secours n’est embarqué.

## Déploiement

```bash
npm run build
```

Le contenu de `dist/` est statique. Il doit être servi avec une redirection SPA vers `index.html`, et `/api/*` doit être proxifié vers le backend.

En production, le frontend et l’API sont servis sur la même origine.

## Dépôt

```text
https://github.com/Nestradama/portfolio-front-end.git
```
