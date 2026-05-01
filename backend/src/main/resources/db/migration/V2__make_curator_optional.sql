-- V2: Add curator_id and make it optional for groups
ALTER TABLE student_groups ADD COLUMN curator_id BIGINT REFERENCES users(id);
