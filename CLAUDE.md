
## Project Conventions (Phase 2 Learnings)

### Package Manager
- **Always use pnpm** (not npm or yarn)
- Commands: `pnpm add`, `pnpm install`, `pnpm dev`, `pnpm build`

### Folder Structure
Use the existing folder structure, don't create a `features/` folder:
- `src/components/` - React components organized by domain (timeline/, timeblock/, ui/)
- `src/hooks/` - Custom React hooks
- `src/stores/` - Zustand stores
- `src/lib/` - Utilities organized by domain (timeline/, db/, utils)
- `src/pages/` - Page components

### Tailwind CSS (v4)
The project uses Tailwind v4 syntax:
- Use `bg-linear-to-b` instead of `bg-gradient-to-b`
- Use `bg-linear-to-t` instead of `bg-gradient-to-t`
- Use `shrink-0` instead of `flex-shrink-0`

### Dependencies
- Use latest version of dependencies (e.g., `pnpm add framer-motion`)
- Current key deps: framer-motion v12, zustand, dexie, date-fns

### GPU Acceleration
For smooth 60fps animations, use these CSS utilities (defined in index.css):
- `.gpu-accelerated` - For animated elements
- `.gpu-scroll` - For scroll containers
- `.scroll-snap-x` / `.scroll-snap-y` - For scroll snapping
- `.no-scrollbar` - Hide scrollbars while keeping functionality

### TypeScript
- Use `ReturnType<typeof setTimeout>` instead of `NodeJS.Timeout` for timer refs
- Use `React.RefObject<HTMLDivElement | null>` for refs that can be null
- Export generic components with type assertion: `as <T>(props: Props<T>) => React.ReactElement`
