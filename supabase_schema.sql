-- Prophet AI Bootcamp -- Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'aluno' CHECK (role IN ('admin', 'aluno', 'auditor')),
    turma TEXT DEFAULT '2026-marco',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can read all" ON user_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Exercise progress
CREATE TABLE IF NOT EXISTS progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    pontos INT DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, exercise_id)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin can read all progress" ON progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Challenge submissions
CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    repo_url TEXT,
    pontos INT DEFAULT 0,
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own submissions" ON submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage all submissions" ON submissions FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT
    p.id AS user_id,
    p.nome,
    p.turma,
    COALESCE(ex.total_exercicios, 0) AS total_exercicios,
    COALESCE(ex.pontos_exercicios, 0) AS pontos_exercicios,
    COALESCE(sub.pontos_desafios, 0) AS pontos_desafios,
    COALESCE(ex.pontos_exercicios, 0) + COALESCE(sub.pontos_desafios, 0) AS pontos_total
FROM user_profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) AS total_exercicios, SUM(pontos) AS pontos_exercicios
    FROM progress WHERE completed = TRUE GROUP BY user_id
) ex ON p.id = ex.user_id
LEFT JOIN (
    SELECT user_id, SUM(pontos) AS pontos_desafios
    FROM submissions GROUP BY user_id
) sub ON p.id = sub.user_id
WHERE p.role = 'aluno'
ORDER BY pontos_total DESC;
