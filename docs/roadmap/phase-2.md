### Phase 2: Timeline MVP (Weeks 2-3)

**Goal:** Build the core visual timeline where users can view and manage their day.

**Deliverable:** A working timeline with time blocks that can be created, edited, and deleted.

- [ ] **Timeline Foundation**

  - [ ] Design Timeline component with 24-hour vertical layout
  - [ ] Implement hourly grid lines with time labels
  - [ ] Add "current time" indicator (red line) with auto-update
  - [ ] Create smooth scroll behavior with scroll-to-current-time
  - [ ] Implement day selector (horizontal date picker)
  - [ ] Add "Today" quick navigation button

- [ ] **Time Block Basics**

  - [ ] Design TimeBlock component with Material Surface styling
  - [ ] Position blocks correctly based on start/end times
  - [ ] Implement block creation modal (title, time pickers)
  - [ ] Add basic time validation (end after start, reasonable hours)
  - [ ] Display blocks on timeline with proper z-index layering
  - [ ] Add context color tinting to blocks

- [ ] **Core Interactions**

  - [ ] Implement tap-to-edit functionality
  - [ ] Add swipe-to-delete with confirmation
  - [ ] Create block detail view (expand on tap)
  - [ ] Add quick actions (complete, reschedule, delete)
  - [ ] Implement optimistic UI updates
  - [ ] Add loading states and error handling

- [ ] **Responsive Timeline**
  - [ ] Optimize timeline for mobile viewports
  - [ ] Adjust font sizes and spacing for readability
  - [ ] Make time blocks easily tappable (44px min height)
  - [ ] Test on various screen sizes (320px to 768px)
