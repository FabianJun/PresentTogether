# Security and classroom data

This is a small classroom application, not a verified student identity or high-stakes voting system.

- A room has a moderator bearer credential and four separate speaker credentials. Credentials are generated at runtime, hashed in the database, and stored in the relevant browser after opening a private link. Anyone receiving a private link can use its permissions.
- Speaker credentials can read that speaker's identity and notes but cannot control slides, votes or reset. The public room code is not a moderator credential.
- Joining does not request a name or email. A browser receives a participant credential. Clearing browser storage or joining from another browser can create another participant; there is no identity-based one-person-one-vote enforcement.
- Results reveal side totals and vote splits. Individual role information and votes exist in the database and moderator export. Do not publish real session databases or exports.
- Comments and extra polls are disabled in the current activity. Legacy tables remain for migrations.
- Room creation is publicly available and rate-limited. This is not a private course enrolment gate. Use an appropriate network or access layer if your setting requires one.
- The server includes request limits, permission checks, a same-origin browser policy and guarded reset. Keep Node and dependencies updated and serve public sessions over HTTPS. Keep the internal app port private.

Keep owner and speaker links out of screenshots, repositories and audience projections. Git ignores common local secrets and data, but an ignore file does not remove anything already committed. A backup contains private application state and must be stored outside the public repository.

For a suspected vulnerability, do not post credentials or student data in a public issue. Use GitHub's private vulnerability reporting if enabled, or provide a minimal report without sensitive information. Rotate compromised presenter credentials or delete the affected room. This repository does not include a maintained hosted service.
