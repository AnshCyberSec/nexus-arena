-- V1__init_schema.sql

-- Enable pgcrypto extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE roles (
                       id UUID PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description VARCHAR(150),
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                       updated_at TIMESTAMP WITH TIME ZONE,
                       version BIGINT NOT NULL
);

-- 2. Users Table
CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       email VARCHAR(150) NOT NULL UNIQUE,
                       password_hash VARCHAR(255),
                       full_name VARCHAR(100) NOT NULL,
                       status VARCHAR(30) NOT NULL,
                       email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
                       mfa_secret VARCHAR(255),
                       failed_attempts INT NOT NULL DEFAULT 0,
                       locked_until TIMESTAMP WITH TIME ZONE,
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                       updated_at TIMESTAMP WITH TIME ZONE,
                       version BIGINT NOT NULL
);

-- 3. User Roles (Many-to-Many Join Table)
CREATE TABLE user_roles (
                            user_id UUID NOT NULL,
                            role_id UUID NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. Refresh Tokens
CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY,
                                token_hash VARCHAR(255) NOT NULL UNIQUE,
                                family_id UUID NOT NULL,
                                user_id UUID NOT NULL,
                                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
                                replaced_by_token VARCHAR(255),
                                created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                updated_at TIMESTAMP WITH TIME ZONE,
                                version BIGINT NOT NULL,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Email Verification Tokens
CREATE TABLE email_verification_tokens (
                                           id UUID PRIMARY KEY,
                                           token_hash VARCHAR(255) NOT NULL UNIQUE,
                                           user_id UUID NOT NULL UNIQUE, -- OneToOne relationship
                                           expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                           verified_at TIMESTAMP WITH TIME ZONE,
                                           created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                           updated_at TIMESTAMP WITH TIME ZONE,
                                           version BIGINT NOT NULL,
                                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Password Reset Tokens
CREATE TABLE password_reset_tokens (
                                       id UUID PRIMARY KEY,
                                       token_hash VARCHAR(255) NOT NULL UNIQUE,
                                       user_id UUID NOT NULL UNIQUE,
                                       expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                       used_at TIMESTAMP WITH TIME ZONE,
                                       created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                       updated_at TIMESTAMP WITH TIME ZONE,
                                       version BIGINT NOT NULL,
                                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. OTP Verifications
CREATE TABLE otp_verification (
                                  id UUID PRIMARY KEY,
                                  user_id UUID NOT NULL,
                                  code_hash VARCHAR(255) NOT NULL,
                                  purpose VARCHAR(50) NOT NULL,
                                  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                  consumed BOOLEAN NOT NULL DEFAULT FALSE,
                                  attempt_count INT NOT NULL DEFAULT 0,
                                  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                  updated_at TIMESTAMP WITH TIME ZONE,
                                  version BIGINT NOT NULL,
                                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Login Attempts
CREATE TABLE login_attempts (
                                id UUID PRIMARY KEY,
                                email VARCHAR(150) NOT NULL,
                                ip_address VARCHAR(45),
                                user_agent VARCHAR(255),
                                is_success BOOLEAN NOT NULL,
                                failure_reason VARCHAR(100),
                                created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                updated_at TIMESTAMP WITH TIME ZONE,
                                version BIGINT NOT NULL
);

-- 9. Audit Logs
CREATE TABLE audit_logs (
                            id UUID PRIMARY KEY,
                            user_id UUID, -- Nullable for system events
                            event_type VARCHAR(50) NOT NULL,
                            ip_address VARCHAR(45),
                            metadata TEXT,
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                            updated_at TIMESTAMP WITH TIME ZONE,
                            version BIGINT NOT NULL
);