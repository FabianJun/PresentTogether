ALTER TABLE rooms ADD COLUMN outcome_view TEXT NOT NULL DEFAULT 'auto';
--> statement-breakpoint
ALTER TABLE rooms ADD COLUMN outcome_round INTEGER NOT NULL DEFAULT -1;
