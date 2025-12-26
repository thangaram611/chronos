# Product Requirements Document (PRD): Chronos PWA

**Version:** 1.0  
**Date:** December 25, 2025  
**Status:** Draft  
**Target Platform:** Progressive Web App (React + Vite)

## 1. Executive Summary

Chronos is a high-performance, visual productivity Progressive Web App designed for users who require strict discipline and clarity in their daily routines. Merging the "Time-Boxed" philosophy with a beautiful, easy-to-use visual timeline, Chronos transforms chaos into a structured flow.

The app leverages modern web technologies—React 19, Vite, and PWA capabilities—to deliver a smooth, app-like experience that works seamlessly online and offline. It operates on a Local-First architecture using IndexedDB, ensuring total data privacy and reliability without a backend.

**Key Differentiators:**

- **Visual Timeline:** A clean, intuitive stream of the day that combines calendar events and to-dos.
- **Smooth Performance:** 60fps interactions via optimized React and Framer Motion.
- **Offline-First:** Works completely offline with intelligent background sync.
- **Adaptive Intelligence:** AI-assisted scheduling using Natural Language Processing and "Magic Wand" auto-fill.
- **Energy-Aligned:** Planning based on user energy levels, not just time.
- **Cross-Platform:** Single codebase that works flawlessly on mobile and web browsers.

## 2. Product Principles

- **Performance First:** Interactions must feel instant with smooth 60fps animations using Framer Motion and optimized React rendering.
- **Progressive Enhancement:** Core features work offline; sync enhances the experience when online.
- **Data Sovereignty:** All data lives in the browser by default. Cloud Sync (Google Drive) is strictly optional and user-controlled.
- **Mobile-First Design:** UI optimized for touch and small screens, progressively enhanced for larger viewports.
- **Aesthetic Utility:** Material Design 3 (Material You) UI with haptic feedback (where supported) to communicate state.
- **Inclusive Precision:** Accessibility (WCAG 2.1 AA) is a first-class citizen.

## 3. Functional Requirements

### 3.1 The Visual Scheduler

- **Timeline Core:** Main view is a vertical scrolling timeline representing the day. Users "Time-Box" tasks by dragging them from an Inbox onto this timeline.
- **Natural Language Input:** Users can type "Gym tomorrow at 5pm" or "Deep Work for 2 hours" to instantly create pre-filled time blocks.
- **Overlap Prevention:** Real-time validation prevents time-block collisions with visual feedback.
- **Gap Highlighting:** Unused time slots are visually highlighted as "Free Time" or subtly indicated based on mode.
- **Smart Auto-Fill:** A "Magic Wand" button analyzes the user's Inbox and automatically slots tasks into available gaps based on priority, estimated duration, and energy level patterns.

### 3.2 Task Management & Structure

- **Inbox:** A holding area for unscheduled thoughts and tasks. Optional auto-archiving for items stale > 48hrs.
- **Subtasks & Notes:** Break down large time-boxed tasks into smaller, checkable subtasks with rich text notes.
- **Recurring Tasks:** Support for complex recurrence patterns (e.g., "Every Monday and Thursday," "Every 3rd day") using RRULE standard.
- **Visual Customization:**
  - **Icons:** 500+ icon library (Lucide React) to represent different task types.
  - **Color Coding:** Users assign colors to Contexts (Work, Health, Social) which tint UI elements.

### 3.3 Focus Mode Features

- **Focus Sessions:** Dedicated full-screen mode for deep work with countdown timer.
- **Progressive Notifications:** Web Notifications API for reminders (requires user permission).
- **Visual Focus Lock:** Full-screen API to minimize distractions during focus sessions.
- **Flow State Audio:** Integrated ambient sound player (white noise, binaural beats, rain) using Web Audio API.
- **Focus Analytics:** Track actual vs. planned time with detailed breakdown.

### 3.4 Energy Monitor

- **Energy Tracking:** Log energy levels (1-10 scale with emoji selectors) throughout the day.
- **Pattern Recognition:** Visual charts showing energy patterns by time of day and day of week.
- **Smart Suggestions:** Magic Wand scheduler avoids placing "Hard" tasks during historically low-energy windows.
- **Energy Prompts:** Optional gentle reminders to log energy at morning, noon, and evening.

### 3.5 Gamification & Analytics

- **Focus Streaks:** Track consecutive days of meeting >80% of scheduled goals.
- **XP System:** Completing tasks yields XP. Focus Mode yields 2x XP. Levels unlock themes and icons.
- **Time Visualization:** Interactive charts showing time distribution by Context using Recharts.
- **Adherence Score:** Daily metric (0-100%) comparing Plan vs. Reality with trend analysis.
- **Achievement System:** Unlock badges like "Early Bird," "Night Owl," and "Consistency Master."

### 3.6 Data Management & Sync

- **IndexedDB Storage:** All data stored locally using Dexie.js for robust querying.
- **Export/Import:** Full app state exportable as encrypted `.chronos` JSON file.
- **Google Drive Sync (Optional):**
  - **Manual Sync:** User explicitly chooses to "Upload to Cloud" or "Download from Cloud."
  - **Background Sync:** When online, automatically sync via Background Sync API.
  - **Conflict Resolution:** Timestamp comparison with user choice (Keep Local / Use Cloud / Merge).
  - **End-to-End Encryption:** Data encrypted client-side before upload using Web Crypto API.

## 4. Technical Architecture

### 4.1 Tech Stack

- **Framework:** React 19 with TypeScript 5.9 (Strict Mode)
- **Build Tool:** Vite 6.x with PWA Plugin (`vite-plugin-pwa`)
- **Styling:** Tailwind CSS 4.x + CSS-in-JS for dynamic theming
- **UI Components:** Radix UI or shadcn/ui (minimal, accessible, customizable)
- **Animations:** Framer Motion 11.x
- **State Management:** Zustand 5.x (simple, performant)
- **Server State:** TanStack Query v5 (for sync operations)
- **Local Database:** Dexie.js 4.x (IndexedDB wrapper)
- **Icons:** Lucide React (tree-shakeable, 1000+ icons)
- **Charts:** Recharts 2.x (native React charts)
- **Date/Time:** date-fns 3.x (lightweight, tree-shakeable)

### 4.2 PWA Features

- **Service Worker:** Workbox 7.x for sophisticated caching strategies
- **Offline Support:** Full app functionality available offline
- **App Manifest:** Installable on mobile home screens and desktop
- **Shortcuts:** Quick actions (New Task, New Event, View Today)
- **Background Sync:** Queue sync operations when offline, execute when online
- **Web Push:** Optional notifications for reminders and achievements
- **File System Access:** For importing/exporting backup files
- **Web Share API:** Share achievements and stats

### 4.3 Database Schema (Dexie.js / IndexedDB)

**Store: schedules**

```typescript
interface Schedule {
  id: string; // UUID
  title: string;
  startTimestamp: number; // Unix timestamp
  endTimestamp: number;
  isLocked: boolean;
  contextId?: string;
  recurrenceRule?: string; // RRULE format
  actualStartTimestamp?: number;
  actualEndTimestamp?: number;
  createdAt: number;
  updatedAt: number;
}
```

**Store: tasks**

```typescript
interface Task {
  id: string; // UUID
  scheduleId?: string; // null if in Inbox
  parentTaskId?: string; // For subtasks
  content: string;
  status: "TODO" | "DONE" | "FAILED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  iconId: string;
  colorHex?: string;
  estimatedMinutes?: number;
  priority: number; // 1-5
  createdAt: number;
  updatedAt: number;
}
```

**Store: contexts**

```typescript
interface Context {
  id: string;
  name: string;
  colorHex: string;
  iconId: string;
  sortOrder: number;
  createdAt: number;
}
```

**Store: energyLogs**

```typescript
interface EnergyLog {
  id: string;
  timestamp: number;
  level: number; // 1-10
  note?: string;
  createdAt: number;
}
```

**Store: settings**

```typescript
interface Setting {
  key: string; // Primary key
  value: any; // JSON-serializable
  updatedAt: number;
}
```

**Store: syncState**

```typescript
interface SyncState {
  id: string;
  lastSyncTimestamp?: number;
  pendingChanges: number;
  googleDriveFileId?: string;
  encryptionKeyHash?: string;
}
```

### 4.4 Caching Strategy

- **App Shell:** Cache-first (HTML, CSS, JS bundles)
- **API Data:** Stale-while-revalidate (if backend is added later)
- **Static Assets:** Cache-first with versioning (icons, fonts, audio files)
- **User Data:** IndexedDB (never cached in service worker)

### 4.5 Performance Targets

- **First Contentful Paint:** < 1.5s on 3G
- **Time to Interactive:** < 3.5s on 3G
- **Interaction Latency:** < 50ms for UI responses
- **Animation Frame Rate:** Consistent 60fps for all animations
- **Lighthouse Score:** 90+ on Performance, Accessibility, Best Practices, SEO

## 5. UI/UX Design Guidelines

### 5.1 Visual Style (Material Design 3 & Mobile-First)

- **Theme Strategy:** "Serene Pastel" theme using Material Design 3 tokens.
  - **Light Mode:** Soft, airy pastel tones (Lavender primary, Mint secondary) on off-white surfaces.
  - **Dark Mode:** Deep, muted slate/charcoal backgrounds with desaturated pastel accents to reduce eye strain.
- **Backgrounds:** Solid surface colors or very subtle, organic mesh gradients (no heavy blurs).
- **Cards:** Material Surface containers (Surface Container Low/High) with varying elevation levels (shadows) and rounded corners (16px-24px).
- **Typography:** System fonts (SF Pro on iOS, Roboto on Android, -apple-system stack) following Material Type Scale.
- **Spacing:** 8px base unit for consistent rhythm.
- **Touch Targets:** Minimum 44x44px for all interactive elements (WCAG compliance).

### 5.2 Responsive Breakpoints

```css
/* Mobile-first approach */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### 5.3 Interaction Design

- **Gestures:**
  - Swipe Right: Mark complete
  - Swipe Left: Reschedule/Delete options
  - Long Press: Enter drag mode
  - Pull Down: Refresh/Sync
- **Haptic Feedback:** Vibration API for tactile feedback (supported browsers only)
- **Keyboard Shortcuts:** Full keyboard navigation for desktop users

### 5.4 Accessibility

- **Screen Readers:** Full ARIA labels and semantic HTML
- **Keyboard Navigation:** Tab order, focus indicators, escape handlers
- **Color Contrast:** WCAG AA minimum (4.5:1 for text)
- **Reduced Motion:** Respect `prefers-reduced-motion` media query
- **Focus Management:** Proper focus trapping in modals and dialogs

## 6. Success Metrics

### Technical Metrics

- **Performance:** Lighthouse score >90 on all categories
- **Reliability:** <0.1% error rate, 99.9% uptime
- **Accessibility:** WCAG 2.1 AA compliant, keyboard navigable
- **Offline:** 100% core features functional offline
- **Load Time:** <1.5s FCP on 3G, <3.5s TTI

### User Metrics

- **Engagement:** 70%+ Daily Active Users (of total users)
- **Retention:** 40%+ users return after 7 days
- **Task Completion:** Average 75%+ adherence score
- **Satisfaction:** >4.5/5 average user rating
- **Growth:** 20% month-over-month user growth (post-launch)

### Business Metrics (Optional)

- **Acquisition:** <$5 cost per acquired user (if running ads)
- **Viral Coefficient:** >0.3 (word-of-mouth referrals)
- **NPS Score:** >50 (would recommend to others)

---

## 7. Risk Assessment & Mitigation

### Technical Risks

**Risk:** Browser compatibility issues (especially iOS Safari)

- **Mitigation:** Test on all major browsers weekly, maintain compatibility matrix, provide fallbacks for unsupported features

**Risk:** IndexedDB data corruption or loss

- **Mitigation:** Implement automatic backups, add data integrity checks, provide easy restore mechanism

**Risk:** Performance degradation with large datasets

- **Mitigation:** Implement virtual scrolling, pagination, database indexing, regular performance testing

**Risk:** Service worker caching issues

- **Mitigation:** Implement cache versioning, add clear cache option, thorough testing of update scenarios

### Product Risks

**Risk:** Users don't understand time-boxing concept

- **Mitigation:** Create excellent onboarding, video tutorials, tooltips, sample schedules

**Risk:** Feature creep delaying launch

- **Mitigation:** Stick to MVP scope, defer nice-to-haves to v1.1, regular scope reviews

**Risk:** Low user retention

- **Mitigation:** Focus on core value prop, gather early feedback, iterate quickly, gamification elements

### External Risks

**Risk:** Google Drive API changes or pricing

- **Mitigation:** Monitor API announcements, keep sync optional, consider alternative providers, have local-only fallback

**Risk:** Competition from established players

- **Mitigation:** Focus on unique visual timeline UX, emphasize privacy and offline-first, build community

---

## 8. Future Considerations (v2.0+)

- **Calendar Integration:** Sync with Google Calendar, Outlook, Apple Calendar
- **Team Collaboration:** Shared schedules, team contexts, collaborative planning
- **Advanced Analytics:** ML-powered insights, productivity recommendations
- **Integrations:** Todoist, Notion, Trello import/export
- **Native Apps:** Consider Electron for desktop, React Native for enhanced mobile
- **Social Features:** Share achievements, compare stats with friends, leaderboards
- **Premium Features:** Advanced themes, unlimited contexts, priority support
- **API:** Open API for third-party integrations and power users
- **Browser Extensions:** Quick add from any webpage, time tracking

---

## 9. Appendix

### Design Resources

- Material Design 3 Guidelines: [m3.material.io](https://m3.material.io)
- Icon library: [Lucide Icons](https://lucide.dev)
- Color palettes: [Coolors.co](https://coolors.co)

### Technical References

- PWA Best Practices: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)
- Dexie.js Documentation: [dexie.org](https://dexie.org)
- RRULE Specification: [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545)
- Web Crypto API: [MDN Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Community

- GitHub Repository: (to be created)
- Discord Server: (to be created)
- Twitter: @chronosapp (to be claimed)

---

**End of Document**

_This PRD is a living document and will be updated as the project evolves. Last updated: December 25, 2025_
