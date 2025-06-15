
-- Ajouter des colonnes manquantes à la table exam_attempts
ALTER TABLE public.exam_attempts 
ADD COLUMN IF NOT EXISTS exam_name TEXT,
ADD COLUMN IF NOT EXISTS exam_type TEXT,
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;

-- Ajouter des politiques RLS pour exam_attempts
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent et les recréer
DROP POLICY IF EXISTS "Users can view their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can view their own exam attempts" 
ON public.exam_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can create their own exam attempts" 
ON public.exam_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can update their own exam attempts" 
ON public.exam_attempts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ajouter des politiques RLS pour subject_performance
ALTER TABLE public.subject_performance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subject performance" ON public.subject_performance;
CREATE POLICY "Users can view their own subject performance" 
ON public.subject_performance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.exam_attempts 
    WHERE id = subject_performance.attempt_id 
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create their own subject performance" ON public.subject_performance;
CREATE POLICY "Users can create their own subject performance" 
ON public.subject_performance 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.exam_attempts 
    WHERE id = subject_performance.attempt_id 
    AND user_id = auth.uid()
  )
);

-- Ajouter des politiques RLS pour attempt_answers
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own attempt answers" ON public.attempt_answers;
CREATE POLICY "Users can view their own attempt answers" 
ON public.attempt_answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.exam_attempts 
    WHERE id = attempt_answers.attempt_id 
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create their own attempt answers" ON public.attempt_answers;
CREATE POLICY "Users can create their own attempt answers" 
ON public.attempt_answers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.exam_attempts 
    WHERE id = attempt_answers.attempt_id 
    AND user_id = auth.uid()
  )
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_completed_at ON public.exam_attempts(completed_at);
CREATE INDEX IF NOT EXISTS idx_subject_performance_attempt_id ON public.subject_performance(attempt_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt_id ON public.attempt_answers(attempt_id);

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_exam_attempts_updated_at ON public.exam_attempts;
CREATE TRIGGER update_exam_attempts_updated_at
    BEFORE UPDATE ON public.exam_attempts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
