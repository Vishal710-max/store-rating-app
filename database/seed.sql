-- Bootstraps one admin account so there's a way into the system on a fresh DB.
-- Password below is the bcrypt hash of "Admin@12345" (10 rounds) — change it after first login.
-- Generate your own with: node -e "console.log(require('bcryptjs').hashSync('YourPassword123!', 10))"

INSERT INTO users (name, email, password_hash, address, role)
VALUES (
    'System Administrator Account',
    'admin@storerating.local',
    '$2b$10$HMI/P048lg8nbk5ewVs.5.EN3026dy1roOQxcSxGhh4AxJ7eqSZl.',
    'Head Office',
    'ADMIN'
)
ON CONFLICT (email) DO NOTHING;
