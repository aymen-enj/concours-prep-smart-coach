-- TABLE: profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: exam_attempts
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  exam_type TEXT,
  subject TEXT,
  duration_minutes INT CHECK (duration_minutes >= 0),
  total_questions INT CHECK (total_questions >= 0),
  score INT CHECK (score >= 0),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: attempt_answers
CREATE TABLE attempt_answers (
  id UUID PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  selected_option TEXT,
  question_subject TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_spent INT CHECK (time_spent >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: subject_performance
CREATE TABLE subject_performance (
  id UUID PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  total_questions INT CHECK (total_questions >= 0),
  score INT CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);
