-- Add birthday column
alter table members add column if not exists birthday date;

-- Optional: Drop age column if we want to rely purely on calculation, 
-- or keep it for caching if needed (but calculation on fly is better).
-- For now, let's keep age but make it nullable/unused in UI, or drop it to avoid confusion.
-- Let's drop it to be clean.
alter table members drop column if exists age;
