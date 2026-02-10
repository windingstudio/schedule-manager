-- Add new columns to members table
alter table members add column if not exists role text;
alter table members add column if not exists is_on_leave boolean default false;
alter table members add column if not exists age integer;
alter table members add column if not exists note text;

-- Add check constraint for role to ensure valid values (optional but good for data integrity)
-- "バンド長", "副バンド長", "組織主任", "音楽主任", "パート長", "副パート長"
-- If we want flexibility, skip the check constraint. I'll skip for flexibility in case they want others later, 
-- but I'll add a comment about expected values.

comment on column members.role is 'Role: "バンド長", "副バンド長", "組織主任", "音楽主任", "パート長", "副パート長"';
