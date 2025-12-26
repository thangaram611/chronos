### Phase 3: Drag & Drop + Overlap Detection (Week 4)

**Goal:** Enable intuitive time block manipulation with visual feedback.

**Deliverable:** Users can drag blocks to reschedule and resize them to adjust duration.

- [ ] **Drag & Drop System**

  - [ ] Integrate Framer Motion drag functionality
  - [ ] Implement long-press to activate drag mode
  - [ ] Add visual feedback (shadow, opacity change) while dragging
  - [ ] Snap blocks to 15-minute increments
  - [ ] Update block time on drop with smooth animation
  - [ ] Add haptic feedback on drag start/end (if supported)

- [ ] **Resize Handles**

  - [ ] Add resize handles to top and bottom of blocks
  - [ ] Implement resize gesture with constraints (min 15 min, max 24 hours)
  - [ ] Show duration preview while resizing
  - [ ] Update database on resize completion
  - [ ] Animate transition smoothly

- [ ] **Overlap Detection**

  - [ ] Implement real-time overlap validation
  - [ ] Show visual warning (red border) when overlap detected
  - [ ] Prevent drop on invalid positions
  - [ ] Add toast notification explaining the conflict
  - [ ] Create "suggest alternative time" feature (nice-to-have)

- [ ] **Performance Optimization**
  - [ ] Debounce drag position updates
  - [ ] Use `will-change` CSS property for animations
  - [ ] Implement virtual scrolling if timeline becomes sluggish
  - [ ] Profile with React DevTools and Chrome Performance
