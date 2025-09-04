-- Initialize PostgreSQL database for Go Portfolio App
-- This file is executed when the PostgreSQL container starts

-- Create the main database (if it doesn't exist)
SELECT 'CREATE DATABASE taskmanager'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskmanager')\gexec

-- Create test database (if it doesn't exist)
SELECT 'CREATE DATABASE taskmanager_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskmanager_test')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO postgres;
GRANT ALL PRIVILEGES ON DATABASE taskmanager_test TO postgres;

-- Connect to main database
\c taskmanager;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
