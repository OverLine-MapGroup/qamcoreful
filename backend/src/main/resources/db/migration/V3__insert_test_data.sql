-- Insert test tenant
INSERT INTO tenants (name, created_at, updated_at) VALUES 
('Test University', NOW(), NOW());

-- Insert test student group
INSERT INTO student_groups (name, tenant_id, created_at, updated_at) VALUES 
('Test Group', 1, NOW(), NOW());

-- Insert test invite codes
INSERT INTO invite_codes (code, tenant_id, group_id, used_at, created_at, updated_at) VALUES 
('TEST-12345', 1, 1, NULL, NOW(), NOW()),
('DEMO-67890', 1, 1, NULL, NOW(), NOW()),
('SAMPLE-11111', 1, 1, NULL, NOW(), NOW());
