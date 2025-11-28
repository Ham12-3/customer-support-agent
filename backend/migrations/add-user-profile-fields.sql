-- Add new profile fields to Users table
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "Company" TEXT,
ADD COLUMN IF NOT EXISTS "JobRole" TEXT,
ADD COLUMN IF NOT EXISTS "Timezone" TEXT,
ADD COLUMN IF NOT EXISTS "AvatarUrl" TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS "IX_Users_Email" ON "Users" ("Email");

