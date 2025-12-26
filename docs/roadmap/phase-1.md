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

- [ ] **Database Layer**

  - [ ] Install and configure Dexie.js
  - [ ] Define database schema with TypeScript interfaces
  - [ ] Create database initialization and migration utilities
  - [ ] Implement base CRUD hooks (`useSchedules`, `useTasks`, `useContexts`)
  - [ ] Add database seeding for development (sample data)

- [ ] **Core Infrastructure**

  - [ ] Set up React Router v7 with lazy loading
  - [ ] Create basic layouts (AppLayout, EmptyLayout)
  - [ ] Install and configure Zustand for UI state
  - [ ] Set up TanStack Query for sync operations
  - [ ] Create error boundary components
  - [ ] Add toast/notification system (sonner or react-hot-toast)

- [ ] **Design System**
  - [ ] Install shadcn/ui or Radix UI components
  - [ ] Create theme configuration (colors, gradients, glassmorphism utilities)
  - [ ] Build base components (Button, Card, Input, Dialog)
  - [ ] Set up Lucide React icon system
  - [ ] Create responsive container components
