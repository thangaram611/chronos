### Phase 8: Natural Language Input (Week 11)

**Goal:** Make task entry effortless with smart parsing.

**Deliverable:** Quick add bar that understands natural language.

- [ ] **NLP Parser**

  - [ ] Implement local date/time parsing (no cloud)
  - [ ] Parse relative times ("tomorrow", "next Monday", "in 2 hours")
  - [ ] Extract duration ("for 30 min", "2 hours")
  - [ ] Detect time patterns ("at 5pm", "from 9-11am")
  - [ ] Infer context from keywords ("gym" → Health, "meeting" → Work)
  - [ ] Handle ambiguous inputs gracefully

- [ ] **Quick Add UI**

  - [ ] Add floating quick-add bar on timeline
  - [ ] Show real-time parse preview as user types
  - [ ] Highlight detected entities (time, duration, context)
  - [ ] One-tap creation from parsed result
  - [ ] Support keyboard shortcuts (Ctrl/Cmd + K)
  - [ ] Add voice input using Web Speech API (optional)

- [ ] **Smart Defaults**

  - [ ] Default to "now" if no time specified
  - [ ] Use last-used context if not specified
  - [ ] Suggest common durations based on task type
  - [ ] Remember user preferences (e.g., "gym" always 1 hour)

- [ ] **Parse Examples**
  - "Gym tomorrow at 5pm" → Task at 17:00 next day
  - "Team meeting 2-3pm" → 1-hour block 14:00-15:00
  - "Deep work for 2 hours" → 2-hour block starting now
  - "Call mom next Monday" → Task on next Mon (no specific time)
