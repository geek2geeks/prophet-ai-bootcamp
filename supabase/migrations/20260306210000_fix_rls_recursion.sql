-- Fix infinite recursion: admin policy queries user_profiles inside user_profiles policy
DROP POLICY IF EXISTS "Admin can read all" ON user_profiles;
DROP POLICY IF EXISTS "Admin can read all progress" ON progress;
DROP POLICY IF EXISTS "Admin can manage all submissions" ON submissions;

-- Replace with JWT-based admin check (no recursion)
CREATE POLICY "Admin can read all profiles" ON user_profiles FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role'
);

CREATE POLICY "Admin can read all progress" ON progress FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role'
);

CREATE POLICY "Admin can manage all submissions" ON submissions FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Also grant leaderboard view access
GRANT SELECT ON leaderboard TO authenticated;
GRANT SELECT ON leaderboard TO anon;
