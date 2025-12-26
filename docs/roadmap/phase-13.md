### Phase 13: Google Drive Sync (Weeks 17-18)

**Goal:** Enable optional cloud backup for cross-device access.

**Deliverable:** Secure Google Drive sync with conflict resolution.

- [ ] **Google Authentication**

  - [ ] Research best OAuth library for React SPA (react-oauth/google)
  - [ ] Set up Google Cloud Console project
  - [ ] Configure OAuth consent screen
  - [ ] Request appropriate scopes (drive.file for app-specific files)
  - [ ] Implement "Sign in with Google" button
  - [ ] Handle OAuth callback and token management
  - [ ] Store tokens securely in IndexedDB
  - [ ] Implement token refresh logic

- [ ] **Drive API Integration**

  - [ ] Set up Google Drive API client
  - [ ] Implement file upload to Drive (app data folder)
  - [ ] Implement file download from Drive
  - [ ] Add file listing (show available backups)
  - [ ] Implement file deletion (old backups)
  - [ ] Handle API errors gracefully (rate limits, network failures)

- [ ] **Sync Manager**

  - [ ] Create Sync Settings screen
  - [ ] Show Google account connection status
  - [ ] Display last sync timestamp
  - [ ] Add "Sync now" manual trigger button
  - [ ] Show sync progress indicator
  - [ ] Implement "Unlink account" with confirmation

- [ ] **Encryption for Cloud**

  - [ ] Encrypt `.chronos` file before upload (Web Crypto API)
  - [ ] Use user's password as encryption key (derive with PBKDF2)
  - [ ] Add encryption indicator in UI (🔒 icon)
  - [ ] Never upload unencrypted data
  - [ ] Document encryption scheme for users

- [ ] **Conflict Resolution**

  - [ ] Compare local and cloud file timestamps
  - [ ] Detect conflicts (both modified since last sync)
  - [ ] Show conflict resolution dialog with options:
    - Keep Local (upload local, overwrite cloud)
    - Use Cloud (download cloud, overwrite local)
    - View Diff (show what changed, advanced)
  - [ ] Preview both versions before choosing
  - [ ] Create automatic backup before overwriting

- [ ] **Background Sync**

  - [ ] Implement auto-sync on WiFi (optional setting)
  - [ ] Use Background Sync API when available
  - [ ] Queue sync operations when offline
  - [ ] Add sync queue indicator in UI
  - [ ] Retry failed syncs with exponential backoff

- [ ] **Sync Status & Logging**
  - [ ] Show sync history (last 10 syncs)
  - [ ] Log sync errors for debugging
  - [ ] Add sync troubleshooting guide
  - [ ] Display data usage statistics
  - [ ] Add "Force pull" and "Force push" options (advanced)
