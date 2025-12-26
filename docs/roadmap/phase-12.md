### Phase 12: Backup & Restore (Week 16)

**Goal:** Ensure data safety with robust export/import.

**Deliverable:** One-click backup with encrypted file format.

- [ ] **Export System**

  - [ ] Implement full database export to JSON
  - [ ] Encrypt export using Web Crypto API (AES-GCM)
  - [ ] Generate `.chronos` file with metadata (version, timestamp)
  - [ ] Add checksum for integrity verification (SHA-256)
  - [ ] Use File System Access API for save location
  - [ ] Fall back to download link if API unavailable

- [ ] **Import System**

  - [ ] Implement file picker for `.chronos` files
  - [ ] Validate file format and checksum
  - [ ] Decrypt file using user password
  - [ ] Show preview of backup contents (date, task count, etc.)
  - [ ] Implement "merge" vs. "replace" options
  - [ ] Add confirmation dialog before overwrite

- [ ] **Auto-Backup**

  - [ ] Schedule automatic backups (daily at 2am)
  - [ ] Store last 7 backups in IndexedDB (with rotation)
  - [ ] Add "Backup now" button in settings
  - [ ] Show backup status (last backup time)
  - [ ] Notify if no backup in 7 days
  - [ ] Add backup history view with restore option

- [ ] **Password Management**
  - [ ] Implement password setup for encryption
  - [ ] Add password strength indicator
  - [ ] Create secure password storage (hashed, never plain text)
  - [ ] Add password recovery flow (backup recovery key)
  - [ ] Test encryption/decryption thoroughly
