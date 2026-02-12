-- Add returned_home_at column to attendances table
ALTER TABLE attendances 
ADD COLUMN IF NOT EXISTS returned_home_at TIMESTAMP WITH TIME ZONE;
