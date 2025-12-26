### Phase 4: Inbox & Task Management (Weeks 5-6)

**Goal:** Capture unscheduled tasks and drag them onto the timeline.

**Deliverable:** A functional Inbox with task CRUD operations and timeline integration.

- [ ] **Inbox Screen**

  - [ ] Create Inbox route and screen layout
  - [ ] Design task list with cards/rows
  - [ ] Add floating action button (FAB) for quick task creation
  - [ ] Implement empty state with onboarding hints
  - [ ] Add sorting options (priority, date created, alphabetical)
  - [ ] Create filter chips (by context, difficulty)

- [ ] **Task Creation & Editing**

  - [ ] Build TaskForm component with all fields
  - [ ] Add icon picker modal with search (Lucide icons)
  - [ ] Implement color picker for custom colors
  - [ ] Add difficulty selector (Easy/Medium/Hard)
  - [ ] Create estimated duration input (minutes)
  - [ ] Add priority selector (1-5 stars)
  - [ ] Include rich text notes area

- [ ] **Inbox Features**

  - [ ] Implement swipe actions (schedule, complete, delete)
  - [ ] Add "stale" indicator for tasks >48 hours old
  - [ ] Create auto-archive toggle in settings
  - [ ] Build bulk actions (select multiple, delete, schedule)
  - [ ] Add task search functionality

- [ ] **Inbox to Timeline Flow**

  - [ ] Create "Schedule" action that opens timeline
  - [ ] Implement drag from Inbox to Timeline (advanced)
  - [ ] Auto-populate time block from task metadata
  - [ ] Remove task from Inbox when scheduled
  - [ ] Add "unschedule" action to move task back to Inbox

- [ ] **Subtasks**
  - [ ] Design subtask UI within task detail
  - [ ] Implement subtask CRUD operations
  - [ ] Add checkbox for completion
  - [ ] Show progress indicator (3/5 done)
  - [ ] Display subtask progress on timeline blocks
