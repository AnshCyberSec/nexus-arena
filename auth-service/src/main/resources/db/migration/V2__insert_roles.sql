-- V2__insert_roles.sql
-- Insert default system roles.
-- Note: We are generating random UUIDs for roles here since they are static.
-- In a real system, you might want deterministic UUIDs, but random is fine for seeds.

INSERT INTO roles (id, name, description, created_at, version)
VALUES
    (gen_random_uuid(), 'ROLE_USER', 'Standard user with basic access', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'ROLE_ADMIN', 'Administrator with elevated privileges', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'ROLE_SUPER_ADMIN', 'Super Administrator with full system access', CURRENT_TIMESTAMP, 1);