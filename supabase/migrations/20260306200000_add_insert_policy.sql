CREATE POLICY "Users can insert own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DO $$ BEGIN
    ALTER TABLE submissions ADD CONSTRAINT submissions_user_challenge_unique 
    UNIQUE (user_id, challenge_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
