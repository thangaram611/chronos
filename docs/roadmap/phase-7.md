### Phase 7: Recurring Tasks & Week View (Weeks 9-10)

**Goal:** Support habits and repeating tasks with a week overview.

**Deliverable:** RRULE-based recurrence system and weekly grid view.

- [ ] **Recurrence Engine**

  - [ ] Integrate RRULE library (rrule.js)
  - [ ] Implement RRULE parser and generator
  - [ ] Support daily, weekly, monthly patterns
  - [ ] Handle custom patterns (Mon/Wed/Fri, every 3 days)
  - [ ] Implement exception dates (skip specific dates)
  - [ ] Generate occurrences on-demand (lazy evaluation)

- [ ] **Recurrence UI**

  - [ ] Design recurrence picker component
  - [ ] Add visual frequency selector (daily, weekly, custom)
  - [ ] Create custom pattern builder
  - [ ] Show recurrence summary ("Every Mon/Wed/Fri")
  - [ ] Add end date/occurrence count options

- [ ] **Recurring Tasks Features**

  - [ ] Show recurrence icon on timeline blocks
  - [ ] Implement "Edit this / Edit all" dialog
  - [ ] Handle single-occurrence modifications
  - [ ] Track completion for each occurrence separately
  - [ ] Show streak counter for daily habits

- [ ] **Week View**

  - [ ] Design 7-day grid layout (mobile-optimized)
  - [ ] Show mini timeline for each day
  - [ ] Display recurring tasks across the week
  - [ ] Add horizontal scroll for week navigation
  - [ ] Implement week-level statistics
  - [ ] Allow drag-and-drop between days

- [ ] **Habit Tracking**
  - [ ] Create dedicated habits section
  - [ ] Show completion calendar (GitHub-style)
  - [ ] Track longest streak and current streak
  - [ ] Add habit-specific analytics
