# 🔥 Strapi v5 & Next.js v15 Monorepo Starter

This is a ready-to-go starter template for Strapi projects. It combines the power of Strapi, Next.js, Shadcn/ui libraries with Turborepo setup and kickstarts your project development. We call it a **Page builder** for enterprise applications.

## 👀 Live demo

- UI - [https://www.notum-dev.cz/](https://www.notum-dev.cz/)
- Strapi - [https://api.notum-dev.cz/admin](https://api.notum-dev.cz/admin)
- **Readonly user:**
  - Email: user@notum.cz
  - Password: Secret-pass-55

## 🥞 Tech stack

- [Strapi v5](https://strapi.io/) - Headless CMS to manage content
- [Next.js App Router v15](https://nextjs.org/docs) - React framework for building web apps
- [Shadcn/ui](https://ui.shadcn.com/) - TailwindCSS based UI components
- [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [Turborepo](https://turbo.build/) - Monorepo management tool to keep things tidy

## 🚀 Getting started

[![Launch Strapi + Next.js Monorepo — Live in 5 Minutes](https://img.youtube.com/vi/VZlJZuurUH8/maxresdefault.jpg)](https://www.youtube.com/watch?v=VZlJZuurUH8 "Watch on YouTube")

### Prerequisites

- Docker
- Node.js 22
- Yarn 1.22
- [nvm](https://github.com/nvm-sh/nvm) (optional, recommended)

### Run dev (in 4 steps)

1. Clone this repository

   ```sh
   git clone https://github.com/notum-cz/strapi-next-monorepo-starter
   ```

1. Install dependencies

   ```sh
   # in root
   # switch to correct nodejs version (v22)
   nvm use

   # install deps for apps and packages that are part of this monorepo
   yarn
   ```

   > Don't worry about warning "Workspaces can only be enabled in private projects <https://github.com/yarnpkg/yarn/issues/8580>

1. Run apps

   > [!WARNING]
   > Before the first run, you need to retrieve [Strapi API token](https://docs.strapi.io/cms/features/api-tokens).
   >
   > ```sh
   > yarn dev:strapi
   > ```
   >
   > Go to Strapi admin URL and navigate to [Settings > API Tokens](http://localhost:1337/admin/settings/api-tokens).
   >
   > Select "Create new API token" and copy it's value to `STRAPI_REST_READONLY_API_KEY` in `/apps/ui/.env.local` file.
   >
   > Refer to the [UI README](apps/ui/README.md#environment-variables) for more details.

   ```sh
   # run all apps in dev mode (this triggers `yarn dev` script in each app from `/apps` directory)
   yarn dev
   ```

1. 🎉 Enjoy!

   - Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the UI app in action.
   - Open your browser and go to [http://localhost:1337/admin](http://localhost:1337/admin) to see the Strapi app in action.

1. Next steps?

   - See [What's inside?](#-whats-inside) for more details about apps and packages.
   - You also probably want to customize naming in the project. See [Transform this template to a project](#-transform-this-template-to-a-project).
   - **NEW:** Set up automations! See [Automation Setup Guide](./AUTOMATION-SETUP.md) for cache invalidation and type generation (15 min setup).

## ✨ Features

- **Strapi**: Fully typed (TypeScript) and up-to-date Strapi v5 controllers and services
- **Strapi config**: Pre-configured and pre-installed with the most common plugins, packages and configurations
- **Page builder**: Page rendering mechanism and prepared useful components. Ready to plug-and-play
- **Strapi live preview**: Preview/draft mode for Next.js app to see changes in Strapi in real-time
- **DB seed**: Seed script to populate DB with initial data
- **Next.js**: Fully typed and modern Next.js v15 App router project
- **Proxies**: Proxy API calls to Strapi from Next.js app to avoid CORS issues, hide API keys and backend address
- **API**: Typed API calls to Strapi via API clients
- **UI library**: 20+ pre-installed components, beautifully designed by [Shadcn/ui](https://ui.shadcn.com/)
- **UI components**: Ready to use components for common use cases (forms, images, tables, navbar and much more)
- **TailwindCSS**: [TailwindCSS v4](https://tailwindcss.com/) setup with configuration and theme, [CVA](https://cva.style/docs), [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) and [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate)
- **CkEditor**: Pre-configured [CkEditor v5](https://ckeditor.com/) WYSIWYG editor with shared styles and colors
- **Utils**: Useful utils, hooks and helper functions included
- **Auth**: JWT authentication with [Strapi Users & Permissions feature](https://docs.strapi.io/cms/features/users-permissions) and [NextAuth.js](https://next-auth.js.org/), auth middleware and protected routes
- **Auth providers**: Ready to plug-in providers like Google, Facebook etc.
- **Localization**: Multi-language support with [next-intl](https://next-intl-docs.vercel.app/) and [@strapi/plugin-i18n](https://www.npmjs.com/package/@strapi/plugin-i18n) packages
- **SEO**: Pre-configured usage of [@strapi/plugin-seo](https://www.npmjs.com/package/@strapi/plugin-seo) and integrated with frontend SEO best practices like metadata, sitemap.xml or robots.txt
- **Turborepo**: Pre-configured, apps and packages connected and controlled by Turbo CLI
- **Dockerized**: Ready to build in Docker containers for production
- **Code quality**: Out-of-the-box ESLint, Prettier, and TypeScript configurations in shareable packages
- **Husky**: Pre-commit hooks for linting, formatting and commit message validation
- **Commitizen**: Commitizen for conventional commits and their generation
- **Heroku ready**: Ready to deploy to Heroku in a few steps
- ... and much more is waiting for you to discover!

## 📚 Documentation

### Getting Started

- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Full development workflow and Git best practices

### Component Development (Start Here! 👇)

- **⭐ [Component Workflow](./COMPONENT_WORKFLOW.md)** - **STEP-BY-STEP** process for creating components (follow this!)
- **📖 [Component Development Guide](./COMPONENT_DEVELOPMENT_GUIDE.md)** - Architecture, examples, and reference
- **⚡ [Quick Reference Card](./QUICK_REFERENCE.md)** - Print-friendly checklist for component creation
- **🎯 [Workflow Improvements](./WORKFLOW_IMPROVEMENTS.md)** - Issues resolved and process improvements
- **🧪 [Test Data Guide](./TEST_DATA_NEW_COMPONENTS.md)** - Sample data for testing components

### Workflow Overview

**New to component development?** Follow this order:

1. Read [Component Workflow](./COMPONENT_WORKFLOW.md) - Complete step-by-step guide
2. Print [Quick Reference](./QUICK_REFERENCE.md) - Keep handy while coding
3. Refer to [Component Development Guide](./COMPONENT_DEVELOPMENT_GUIDE.md) - For detailed examples

**Creating a component:**

```
Phase 1: Backend (Strapi schemas)     → 15 min
Phase 2: Type Generation              → 2 min
Phase 3: Frontend (React components)  → 30 min
Phase 4: Testing & Validation         → 10 min
```

See [COMPONENT_WORKFLOW.md](./COMPONENT_WORKFLOW.md) for complete process.

## 💡 Transform this template to a project

- In the root `package.json`, update the `name` and `description` fields to match the new project name. Optionally, update the names in `/apps` and `/packages` as well. Keep the `@repo` prefix unless you prefer a different scope or company name—changing it will require updates throughout the entire monorepo.
- In [docker-compose.yml](./apps/strapi/docker-compose.yml), update the top-level name "dev-templates" (and optionally the network name) to reflect the new project name. This helps prevent name conflicts on developers' machines.
- If you're not deploying to Heroku, remove all `Procfile`s from the repository.
- For Heroku deployment, create an S3 bucket and configure the necessary environment variables, as Heroku deletes uploaded files after dyno restarts.

_[After this preparation is done, delete this section from README]_

## ☕ Turborepo scripts

After installing dependencies and setting env vars up, you can control all apps using Turbo CLI. Some common commands are wrapped into `yarn` scripts. You can find them in root [package.json](./package.json) file. For example:

```bash
# run all apps in dev mode (this triggers `yarn dev` script in each app from `/apps` directory)
yarn dev

# build all apps
yarn build

# dev run of specific app(s)
yarn dev:ui
yarn dev:strapi
```

## � Documentation

- **[Component Development Guide](COMPONENT_DEVELOPMENT_GUIDE.md)** - Complete step-by-step guide for adding new sections, elements, and forms to the CMS
- **[Project Status & Roadmap](PROJECT_STATUS.md)** - Component inventory and development roadmap
- **[Test Data Guide](TEST_DATA_NEW_COMPONENTS.md)** - Sample data for testing new components
- **[Quick Start Guide](QUICK_START.md)** - Get up and running quickly
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - Detailed development workflow

## �🔌 VSCode Extensions

Install extensions listed in the [.vscode/extensions.json](.vscode/extensions.json) file and have a better development experience.

## 🔱 Husky tasks

Husky is installed by default and configured to run following tasks:

1. `lint` (eslint) and `format` (prettier) on every commit (`pre-commit` hook). To do that, [lint-staged](https://www.npmjs.com/package/lint-staged) library is used. This is a fast failsafe to ensure code doesn't get committed if it fails linting rules and that when it does get committed, it is consistently formatted. Running linters only on staged files (those that have been added to Git index using `git add`) is much faster than processing all files in the working directory. The `format` task is configured in root `.lintstagedrc.js` and run globally for whole monorepo. The `lint` task is configured in each app individually and Strapi is skipped by default.

2. `commitlint` on every commit message (`commit-msg` hook). It checks if commit messages meet [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format.

## 📿 Scripts

### Package.json

- `yarn commit` - interactive commit message generator 🔥. How? Stage files you want to commit (e.g. using VS Code Source Control) and then run this script in the terminal from root and fill in the required information.
- `yarn format` - format code using prettier in whole monorepo. Prettier formats `package.json` files too.

### Utils

- `bash ./scripts/utils/rm-modules.sh` - Remove all `node_modules` folders in the monorepo. Useful for scratch dependencies installation.
- `bash ./scripts/utils/rm-all.sh` - Remove all `node_modules`, `.next`, `.turbo`, `.strapi`, `dist` folders.

## ♾️ CI/CD

### GitHub Actions

We are using `GitHub Actions` for continuous integration. The `CI` expects some variables (`APP_PUBLIC_URL`, `STRAPI_URL` and `STRAPI_REST_READONLY_API_KEY`) to be available on the runner, so make sure to add them in the repository's settings. Have a look at the [workflow](.github/workflows/ci.yml) definition for more details.

### Heroku

- `./scripts/heroku/heroku-postbuild.sh` - Script for Heroku deployment to decide which app to build. It can be removed if not deploying to Heroku.

## 💙 Feedback

This repository was created based on [strapi-next-monorepo-starter](https://github.com/notum-cz/strapi-next-monorepo-starter). If you encounter a problem with the template code during development, or you have implemented a useful feature that should be part of that template, please create an issue with a description or PR in that repository. So we can keep it updated with great features.
