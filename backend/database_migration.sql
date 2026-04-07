-- Approval Workflow System - Consolidated Database Migration Script
-- Dialect: PostgreSQL

BEGIN;

-- 1. Create Roles Table
CREATE TABLE IF NOT EXISTS "roles" (
    "id" SERIAL PRIMARY KEY,
    "role_name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(20) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "role_id" INTEGER NOT NULL REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Approval Workflows Table
CREATE TABLE IF NOT EXISTS "approval_workflows" (
    "id" SERIAL PRIMARY KEY,
    "entity_type" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "approval_required" BOOLEAN DEFAULT true,
    "auto_publish" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Approval Workflow Rules Table
CREATE TABLE IF NOT EXISTS "approval_workflow_rules" (
    "id" SERIAL PRIMARY KEY,
    "workflow_id" INTEGER NOT NULL REFERENCES "approval_workflows" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "condition_type" VARCHAR(50) NOT NULL,
    "condition_value" VARCHAR(100) NOT NULL,
    "approval_required" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Approval Levels Table
CREATE TABLE IF NOT EXISTS "approval_levels" (
    "id" SERIAL PRIMARY KEY,
    "rule_id" INTEGER NOT NULL REFERENCES "approval_workflow_rules" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "level_no" INTEGER NOT NULL,
    "approver_type" VARCHAR(20) NOT NULL,
    "approver_user_id" INTEGER REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "approver_role_id" INTEGER REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "is_mandatory" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Purchase Requests Table
CREATE TABLE IF NOT EXISTS "purchase_requests" (
    "id" BIGSERIAL PRIMARY KEY,
    "pr_number" VARCHAR(50) NOT NULL UNIQUE,
    "customer_name" VARCHAR(255) NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(30) DEFAULT 'PENDING',
    "created_by" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Approval Requests Table
CREATE TABLE IF NOT EXISTS "approval_requests" (
    "id" SERIAL PRIMARY KEY,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" BIGINT NOT NULL,
    "current_level" INTEGER DEFAULT 1,
    "status" VARCHAR(30) DEFAULT 'PENDING',
    "created_by" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Approval Request Steps Table
CREATE TABLE IF NOT EXISTS "approval_request_steps" (
    "id" SERIAL PRIMARY KEY,
    "approval_request_id" INTEGER NOT NULL REFERENCES "approval_requests" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "level_no" INTEGER NOT NULL,
    "approver_user_id" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "status" VARCHAR(30) DEFAULT 'PENDING',
    "action_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Approval Actions Table
CREATE TABLE IF NOT EXISTS "approval_actions" (
    "id" SERIAL PRIMARY KEY,
    "approval_request_id" INTEGER NOT NULL REFERENCES "approval_requests" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "level_no" INTEGER NOT NULL,
    "action" VARCHAR(30) NOT NULL,
    "action_by" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    "remarks" TEXT,
    "action_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA
-- Default Roles
INSERT INTO "roles" ("id", "role_name", "is_active", "created_at", "updated_at") VALUES 
(1, 'SALES_EXEC', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'MANAGER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Default Users (Password is 'password123' for regular users, 'admin1234' for Admin)
-- Hashes generated via bcrypt (salt rounds 10)
INSERT INTO "users" ("id", "name", "email", "phone", "password", "role_id", "is_active", "created_at", "updated_at") VALUES 
(101, 'Kavya (Sales Exec)', 'kavya@isquare.com', '9876543211', '$2b$10$fExzIvDJlzK77GZoG3670.gk1B1buk5jimnNr7J8RJ7kYmhbLU1ky', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(102, 'Mithra (Manager)', 'mithra@isquare.com', '9876543210', '$2b$10$fExzIvDJlzK77GZoG3670.gk1B1buk5jimnNr7J8RJ7kYmhbLU1ky', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(103, 'Janani (Manager)', 'janani@isquare.com', '9876543212', '$2b$10$fExzIvDJlzK77GZoG3670.gk1B1buk5jimnNr7J8RJ7kYmhbLU1ky', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(104, 'Admin User', 'admin@isquare.com', '9876543213', '$2b$10$fExzIvDJlzK77GZoG3670.JYeEBm3aB53y9TI0QMONrqw6/.g.hhq', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Default Workflow for Purchase Requests
INSERT INTO "approval_workflows" ("id", "entity_type", "action", "approval_required", "auto_publish", "is_active", "created_at", "updated_at") VALUES 
(1, 'PR', 'CREATE', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Workflow Rules
INSERT INTO "approval_workflow_rules" ("id", "workflow_id", "condition_type", "condition_value", "approval_required", "created_at", "updated_at") VALUES 
(1, 1, 'ROLE', 'SALES_EXEC', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'ROLE', 'MANAGER', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Approval Levels
-- Level 1: Specifically Mithra (User ID 102)
-- Level 2: Any Manager (Role ID 2)
INSERT INTO "approval_levels" ("rule_id", "level_no", "approver_type", "approver_user_id", "approver_role_id", "is_mandatory", "created_at", "updated_at") VALUES 
(1, 1, 'USER', 102, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 'ROLE', NULL, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
