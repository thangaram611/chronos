### Phase 6: PWA Enhancements & Offline (Week 8)

**Goal:** Make Chronos a true PWA with installation and offline support.

**Deliverable:** Installable app that works fully offline with background sync.

- [ ] **PWA Manifest**

  - [ ] Configure app manifest with proper metadata
  - [ ] Create app icons (192x192, 512x512, maskable)
  - [ ] Add splash screens for iOS/Android
  - [ ] Define app shortcuts (New Task, New Event, View Today)
  - [ ] Set display mode to `standalone`
  - [ ] Configure theme colors

- [ ] **Service Worker**

  - [ ] Configure Workbox precaching for app shell
  - [ ] Implement stale-while-revalidate for assets
  - [ ] Add offline fallback page
  - [ ] Create cache versioning strategy
  - [ ] Add cache cleanup on update

- [ ] **Offline Experience**

  - [ ] Show online/offline indicator in UI
  - [ ] Queue failed operations when offline
  - [ ] Add "offline mode" banner with helpful info
  - [ ] Test all core features work offline
  - [ ] Implement graceful degradation for sync features

- [ ] **Background Sync**

  - [ ] Register Background Sync API for queued operations
  - [ ] Implement sync queue in IndexedDB
  - [ ] Add sync indicator (pending uploads icon)
  - [ ] Test background sync on mobile browsers
  - [ ] Handle sync conflicts elegantly

- [ ] **Installation Prompt**
  - [ ] Detect if app is installable
  - [ ] Show custom install prompt (not immediately)
  - [ ] Track if user dismissed prompt (don't nag)
  - [ ] Show install success message
  - [ ] Add "Add to Home Screen" in settings
