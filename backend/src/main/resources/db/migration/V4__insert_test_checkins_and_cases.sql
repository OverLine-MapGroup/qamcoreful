INSERT INTO student_cases (student_id, psychologist_id, tenant_id, status, intro_message, communication_link, created_at, updated_at) VALUES 
(28, 5, 1, 'OPEN', 'Test case for student', 'https://test-link.com', NOW(), NOW()),
(28, 5, 1, 'OPEN', 'Another test case', 'https://another-link.com', NOW(), NOW());

INSERT INTO checkins (user_id, tenant_id, total_score, risk_level, scoring_version, answers, created_at, updated_at) VALUES 
(28, 1, 15, 'MEDIUM', 'weekly-v1', '{"q1":3,"q2":4,"q3":5}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(5, 1, 8, 'LOW', 'weekly-v1', '{"q1":2,"q2":3,"q3":3}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');
