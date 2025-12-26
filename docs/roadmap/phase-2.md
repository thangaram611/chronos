### Phase 2: Timeline MVP (Weeks 2-3)

**Goal:** Build the core visual timeline where users can view and manage their day.

**Deliverable:** A working timeline with time blocks that can be created, edited, and deleted.

- [ ] **Timeline Foundation**

  - [x] Design Timeline component with 24-hour vertical layout
  - [x] Implement hourly grid lines with time labels
  - [x] Add "current time" indicator (line) with auto-update
  - [ ] Create smooth scroll behavior with scroll-to-current-time
  - [x] Implement day selector (horizontal date picker)
  - [ ] Add "Today" quick navigation button

- [ ] **Time Block Basics**

  - [x] Design TimeBlock component with Material Surface styling
  - [x] Position blocks correctly based on start/end times
  - [x] Implement block creation modal (title, time pickers)
  - [x] Add basic time validation (end after start, reasonable hours)
  - [x] Display blocks on timeline with proper z-index layering
  - [x] Add context color tinting to blocks

- [ ] **Core Interactions**

  - [x] Implement tap-to-edit functionality
  - [x] Add swipe-to-delete with confirmation
  - [x] Create block detail view (expand on tap)
  - [x] Implement optimistic UI updates
  - [ ] Add loading states and error handling

- [ ] **Responsive Timeline**
  - [x] Optimize timeline for mobile viewports
  - [x] Adjust font sizes and spacing for readability
  - [x] Make time blocks easily tappable (44px min height)
  - [x] Test on various screen sizes (320px to 768px)
