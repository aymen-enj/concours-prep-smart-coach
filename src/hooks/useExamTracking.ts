
import { useState, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { startExamAttempt, saveExamResult, calculateSubjectPerformances, ExamSession, QuestionAnswer } from '@/services/examResultsService';
import { useToast } from '@/hooks/use-toast';

export const useExamTracking = () => {
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const startExam = useCallback(async (examSession: Omit<ExamSession, 'userId'>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour passer un examen",
        variant: "destructive"
      });
      return null;
    }

    try {
      const sessionWithUser = { ...examSession, userId: user.id };
      const attempt = await startExamAttempt(sessionWithUser);
      
      setCurrentAttemptId(attempt.id);
      setStartTime(new Date());
      setAnswers([]);
      
      console.log('Exam started successfully:', attempt.id);
      return attempt.id;
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'examen",
        variant: "destructive"
      });
      return null;
    }
  }, [user, toast]);

  const saveAnswer = useCallback((answer: QuestionAnswer) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionNumber === answer.questionNumber);
      if (existingIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = answer;
        return newAnswers;
      }
      return [...prev, answer];
    });
  }, []);

  const finishExam = useCallback(async (totalQuestions: number) => {
    if (!currentAttemptId || !startTime) {
      toast({
        title: "Erreur",
        description: "Aucun examen en cours",
        variant: "destructive"
      });
      return false;
    }

    try {
      const endTime = new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      const subjectPerformances = calculateSubjectPerformances(answers);
      
      const examResult = {
        attemptId: currentAttemptId,
        score,
        totalQuestions,
        durationMinutes,
        answers,
        subjectPerformances
      };

      await saveExamResult(examResult);
      
      // Reset l'état
      setCurrentAttemptId(null);
      setStartTime(null);
      setAnswers([]);
      
      toast({
        title: "Examen terminé",
        description: `Score final : ${score}%`,
        variant: "default"
      });
      
      console.log('Exam finished successfully with score:', score);
      
      // Déclencher un événement personnalisé pour rafraîchir les statistiques
      window.dispatchEvent(new CustomEvent('examCompleted', { 
        detail: { score, totalQuestions, durationMinutes } 
      }));
      
      return true;
    } catch (error) {
      console.error('Error finishing exam:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les résultats",
        variant: "destructive"
      });
      return false;
    }
  }, [currentAttemptId, startTime, answers, toast]);

  const getCurrentStats = useCallback(() => {
    if (!answers.length) return { score: 0, answered: 0 };
    
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    return {
      score: Math.round((correctAnswers / answers.length) * 100),
      answered: answers.length
    };
  }, [answers]);

  return {
    currentAttemptId,
    isExamActive: !!currentAttemptId,
    startExam,
    saveAnswer,
    finishExam,
    getCurrentStats,
    answers
  };
};
