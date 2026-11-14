ALTER TABLE members ADD COLUMN role_id TEXT NOT NULL DEFAULT 'undecided';
--> statement-breakpoint
WITH seats AS (
 SELECT id,ROW_NUMBER() OVER (PARTITION BY room,team ORDER BY created,rowid) AS n FROM members
)
UPDATE members SET role_id=COALESCE((SELECT CASE n WHEN 1 THEN 'government' WHEN 2 THEN 'lab' WHEN 3 THEN 'safety' WHEN 4 THEN 'public' ELSE 'undecided' END FROM seats WHERE seats.id=members.id),'undecided');
--> statement-breakpoint
CREATE UNIQUE INDEX unique_council_roles ON members(room,team,role_id) WHERE role_id<>'undecided';
