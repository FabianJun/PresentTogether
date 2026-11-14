CREATE TABLE rooms (code TEXT PRIMARY KEY, host_hash TEXT NOT NULL, slide INTEGER NOT NULL DEFAULT 0, opened INTEGER NOT NULL DEFAULT 1, revealed INTEGER NOT NULL DEFAULT 0, round INTEGER NOT NULL DEFAULT -1, history TEXT NOT NULL DEFAULT '[]', created INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE members (id TEXT PRIMARY KEY, room TEXT NOT NULL REFERENCES rooms(code), team TEXT NOT NULL, created INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX member_room ON members(room);
--> statement-breakpoint
CREATE TABLE answers (room TEXT NOT NULL REFERENCES rooms(code), member TEXT NOT NULL REFERENCES members(id), module TEXT NOT NULL, value TEXT NOT NULL, policy TEXT NOT NULL DEFAULT '', reply TEXT NOT NULL DEFAULT '', visible INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (room, member, module));
--> statement-breakpoint
CREATE INDEX answer_room ON answers(room,module);
