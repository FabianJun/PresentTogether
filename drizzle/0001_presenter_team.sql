ALTER TABLE rooms ADD COLUMN diagram_mode INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE rooms ADD COLUMN active_speaker INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
CREATE TABLE presenters (room TEXT NOT NULL REFERENCES rooms(code) ON DELETE CASCADE, slot INTEGER NOT NULL, label TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, last_seen INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(room,slot));
