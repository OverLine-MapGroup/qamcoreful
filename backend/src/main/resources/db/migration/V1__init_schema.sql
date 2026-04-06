CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    group_id BIGINT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE student_groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT fk_users_group FOREIGN KEY (group_id) REFERENCES student_groups(id);

CREATE TABLE invite_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    group_id BIGINT REFERENCES student_groups(id),
    user_id BIGINT UNIQUE REFERENCES users(id),
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE checkins (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    tenant_id BIGINT,
    total_score INT NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    scoring_version VARCHAR(255) NOT NULL,
    answers TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE student_cases (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id),
    psychologist_id BIGINT NOT NULL REFERENCES users(id),
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    status VARCHAR(20) NOT NULL,
    intro_message TEXT NOT NULL,
    communication_link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    resolution_comment TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

ALTER TABLE users ADD COLUMN booking_url VARCHAR(255);

CREATE TABLE booking_events (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id),
    psychologist_id BIGINT NOT NULL REFERENCES users(id),
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_events_tenant ON booking_events(tenant_id);

CREATE INDEX idx_complaints_tenant_category_status ON complaints(tenant_id, category, status);

CREATE INDEX idx_student_cases_student_status ON student_cases(student_id, status);
CREATE INDEX idx_student_cases_tenant ON student_cases(tenant_id);

CREATE INDEX idx_user_tenant_role ON users(tenant_id, role);
CREATE INDEX idx_user_group ON users(group_id);

CREATE INDEX idx_invite_tenant_user ON invite_codes(tenant_id, user_id);
CREATE INDEX idx_invite_group_user ON invite_codes(group_id, user_id);

CREATE INDEX idx_checkin_tenant_date ON checkins(tenant_id, created_at);
CREATE INDEX idx_checkin_user_date ON checkins(user_id, created_at);
CREATE INDEX idx_checkin_risk_level ON checkins(risk_level);

CREATE TABLE event_publication (
    id UUID PRIMARY KEY,
    listener_id VARCHAR(512) NOT NULL,
    event_type VARCHAR(512) NOT NULL,
    serialized_event TEXT NOT NULL,
    publication_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_event_publication_uncompleted
ON event_publication (completion_date)
WHERE completion_date IS NULL;