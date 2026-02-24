-- Add category column to test table
-- This migration adds a category field to support test categorization and filtering

ALTER TABLE test
ADD COLUMN IF NOT EXISTS category VARCHAR(255) NOT NULL DEFAULT 'General';

-- Add index for better query performance on category filtering
CREATE INDEX IF NOT EXISTS idx_test_category ON test (category);