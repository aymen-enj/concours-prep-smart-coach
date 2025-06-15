
import { supabase } from "@/integrations/supabase/client";

export interface ExamSession {
  examId: string;
  examName: string;
  examType: string;
  subject: string;
  totalQuestions: number;
  userId: string;
}

export interface QuestionAnswer {
  questionNumber: number;
  selectedOption: string | null;
  isCorrect: boolean;
  timeSpent: number; // en secondes
  questionSubject?: string;
}

export interface ExamResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  durationMinutes: number;
  answers: QuestionAnswer[];
  subjectPerformances: Array<{
    subjectName: string;
    score: number;
    totalQuestions: number;
  }>;
}

export const startExamAttempt = async (examSession: ExamSession) => {
  console.log('Starting exam attempt:', examSession);
  
  const { data, error } = await supabase
    .from('exam_attempts')
    .insert({
      user_id: examSession.userId,
      exam_id: examSession.examId,
      exam_name: examSession.examName,
      exam_type: examSession.examType,
      subject: examSession.subject,
      total_questions: examSession.totalQuestions,
      score: 0,
      started_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting exam attempt:', error);
    throw error;
  }

  console.log('Exam attempt started:', data);
  return data;
};

export const saveExamResult = async (examResult: ExamResult) => {
  console.log('Saving exam result:', examResult);

  // 1. Mettre à jour l'attempt avec le score final et completed_at
  const { error: attemptError } = await supabase
    .from('exam_attempts')
    .update({
      score: examResult.score,
      duration_minutes: examResult.durationMinutes,
      completed_at: new Date().toISOString()
    })
    .eq('id', examResult.attemptId);

  if (attemptError) {
    console.error('Error updating exam attempt:', attemptError);
    throw attemptError;
  }

  // 2. Sauvegarder toutes les réponses
  const answersToInsert = examResult.answers.map(answer => ({
    attempt_id: examResult.attemptId,
    question_number: answer.questionNumber,
    selected_option: answer.selectedOption,
    is_correct: answer.isCorrect,
    time_spent: answer.timeSpent,
    question_subject: answer.questionSubject || null
  }));

  const { error: answersError } = await supabase
    .from('attempt_answers')
    .insert(answersToInsert);

  if (answersError) {
    console.error('Error saving answers:', answersError);
    throw answersError;
  }

  // 3. Sauvegarder les performances par matière
  const performancesToInsert = examResult.subjectPerformances.map(perf => ({
    attempt_id: examResult.attemptId,
    subject_name: perf.subjectName,
    score: perf.score,
    total_questions: perf.totalQuestions
  }));

  const { error: performanceError } = await supabase
    .from('subject_performance')
    .insert(performancesToInsert);

  if (performanceError) {
    console.error('Error saving subject performance:', performanceError);
    throw performanceError;
  }

  console.log('Exam result saved successfully');
  return true;
};

export const getExamAttempt = async (attemptId: string) => {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('id', attemptId)
    .single();

  if (error) {
    console.error('Error fetching exam attempt:', error);
    throw error;
  }

  return data;
};

// Utilitaire pour calculer les performances par matière
export const calculateSubjectPerformances = (answers: QuestionAnswer[]): Array<{
  subjectName: string;
  score: number;
  totalQuestions: number;
}> => {
  const subjectMap = new Map<string, { correct: number; total: number }>();
  
  answers.forEach(answer => {
    const subject = answer.questionSubject || 'Général';
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, { correct: 0, total: 0 });
    }
    
    const subjectData = subjectMap.get(subject)!;
    subjectData.total += 1;
    if (answer.isCorrect) {
      subjectData.correct += 1;
    }
  });
  
  return Array.from(subjectMap.entries()).map(([subjectName, data]) => ({
    subjectName,
    score: Math.round((data.correct / data.total) * 100),
    totalQuestions: data.total
  }));
};
