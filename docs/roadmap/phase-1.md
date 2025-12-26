### Phase 1: Foundation & Setup (Week 1)

**Goal:** Project scaffolding with modern tooling and base architecture.

**Deliverable:** A running PWA with routing, database, and basic theming.

- [x] **Project Initialization**
  - [x] Initialize Vite + React + TypeScript project
  - [x] Configure `vite-plugin-pwa` with basic manifest
  - [x] Set up Tailwind CSS 4.x with custom design tokens
  - [x] Configure ESLint (with React hooks, a11y plugins) and Prettier
  - [x] Set up folder structure (`/src/features`, `/src/components`, `/src/lib`, `/src/hooks`, `/src/stores`)
  - [x] Configure path aliases (`@/components`, `@/lib`, etc.)

- [x] **Database Layer**
  - [x] Install and configure Dexie.js
  - [x] Define database schema with TypeScript interfaces
  - [x] Create database initialization and migration utilities
  - [x] Implement base CRUD hooks (`useSchedules`, `useTasks`, `useContexts`)
  - [x] Add database seeding for development (sample data)

- [x] **Core Infrastructure**
  - [x] Set up React Router v7 with lazy loading
  - [x] Create basic layouts (AppLayout, EmptyLayout)
  - [x] Install and configure Zustand for UI state
  - [x] Set up TanStack Query for sync operations
  - [x] Create error boundary components
  - [x] Add toast/notification system (sonner)

- [x] **Design System**
  - [x] Install shadcn/ui or Radix UI components
  - [x] Create theme configuration (colors, Material Design tokens)
  - [x] Build base components (Button, Card, Input, Dialog)
  - [x] Set up Lucide React icon system
  - [x] Create responsive container components
