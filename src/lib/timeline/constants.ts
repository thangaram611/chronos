/**
 * Timeline configuration constants
 * All measurements are in pixels unless otherwise noted
 */

// Timeline dimensions
export const HOUR_HEIGHT_PX = 60; // Height of one hour in pixels (1440px for 24h)
export const MIN_BLOCK_HEIGHT_PX = 44; // Minimum touch target height (WCAG)
export const TIME_GUTTER_WIDTH_PX = 56; // Width of time labels column
export const BLOCK_HORIZONTAL_PADDING_PX = 8; // Padding between blocks
export const BLOCK_GAP_PX = 2; // Gap between overlapping block columns

// Timeline hours
export const TIMELINE_START_HOUR = 0; // 12:00 AM
export const TIMELINE_END_HOUR = 24; // 12:00 AM next day
export const TOTAL_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;
export const TIMELINE_HEIGHT_PX = TOTAL_HOURS * HOUR_HEIGHT_PX; // 1440px

// Time snapping
export const SNAP_INTERVAL_MINUTES = 15; // Snap to 15-minute intervals
export const SNAP_INTERVALS_PER_HOUR = 60 / SNAP_INTERVAL_MINUTES;

// Current time indicator
export const CURRENT_TIME_UPDATE_INTERVAL_MS = 60000; // Update every minute

// Swipe gestures
export const SWIPE_THRESHOLD_PX = 80; // Minimum swipe distance to trigger action
export const SWIPE_VELOCITY_THRESHOLD = 500; // Pixels per second
export const SWIPE_ACTION_WIDTH_PX = 80; // Width of revealed action button
export const SWIPE_REVEAL_POSITION_PX = 80; // Position where action stays revealed
export const SWIPE_CONFIRM_THRESHOLD_PX = 150; // Swipe further to auto-confirm

// Animations (Framer Motion)
export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

export const TWEEN_CONFIG = {
  type: 'tween' as const,
  duration: 0.15,
  ease: 'easeOut' as const,
};

// Scroll behavior
export const SCROLL_PADDING_TOP_PX = 100; // Padding above current time when scrolling
export const SCROLL_TO_TIME_DURATION_MS = 300;

// Day wheel picker
export const DAY_ITEM_WIDTH_PX = 56; // Width of each day item
export const DAY_ITEM_GAP_PX = 8; // Gap between day items
export const DAY_WHEEL_VISIBLE_ITEMS = 7; // Total visible items (odd number for center selection)
export const DAY_WHEEL_RENDER_BUFFER = 5; // Extra items to render outside viewport for smooth scroll
export const DAY_WHEEL_CHUNK_SIZE = 30; // Days to load per chunk for infinite scroll
export const DAY_WHEEL_EDGE_THRESHOLD = 10; // Items from edge to trigger chunk load

// Colors (for programmatic use - prefer CSS variables when possible)
export const CURRENT_TIME_COLOR = 'hsl(265, 50%, 60%)'; // Primary lavender
export const COMPLETE_ACTION_COLOR = 'hsl(150, 40%, 45%)'; // Mint (secondary)
export const UNCOMPLETE_ACTION_COLOR = 'hsl(40, 60%, 50%)'; // Amber
export const DELETE_ACTION_COLOR = 'hsl(0, 70%, 55%)'; // Softer red
