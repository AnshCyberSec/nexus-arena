-- V3__add_indexes.sql
-- Add performance indexes for frequent queries

-- 1. Login Attempts: Fast lookup for account lockout logic
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_created_at ON login_attempts(created_at);

-- 2. Refresh Tokens: Fast lookup during token rotation
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_family_id ON refresh_tokens(family_id);

-- 3. Audit Logs: Fast lookup for admin dashboard (pagination)
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);

-- 4. OTP Verifications: Fast lookup for OTP checking
CREATE INDEX idx_otp_verification_user_purpose ON otp_verification(user_id, purpose);
