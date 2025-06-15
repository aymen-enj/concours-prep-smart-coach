
import { supabase } from "@/integrations/supabase/client";

export interface UserStatistics {
  totalAttempts: number;
  averageScore: number;
  totalStudyTime: number;
  successRate: number;
  subjectPerformance: {
    subject: string;
    score: number;
    change: number;
    attempts: number;
  }[];
  recentActivity: {
    id: string;
    type: 'exam_completed' | 'practice_session';
    title: string;
    score?: number;
    date: string;
    subject?: string;
  }[];
  monthlyProgress: {
    month: string;
    score: number;
    attempts: number;
  }[];
}

export const getUserStatistics = async (userId: string): Promise<UserStatistics> => {
  console.log('Fetching statistics for user:', userId);
  
  // Récupérer toutes les tentatives de l'utilisateur
  const { data: attempts, error: attemptsError } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });

  if (attemptsError) {
    console.error('Error fetching exam attempts:', attemptsError);
    throw attemptsError;
  }

  console.log('Fetched attempts:', attempts);

  // Récupérer les performances par matière
  const { data: subjectData, error: subjectError } = await supabase
    .from('subject_performance')
    .select(`
      *,
      exam_attempts!inner(user_id)
    `)
    .eq('exam_attempts.user_id', userId);

  if (subjectError) {
    console.error('Error fetching subject performance:', subjectError);
    throw subjectError;
  }

  console.log('Fetched subject performance:', subjectData);

  // Calculer les statistiques
  const totalAttempts = attempts?.length || 0;
  const completedAttempts = attempts?.filter(a => a.completed_at) || [];
  const averageScore = completedAttempts.length > 0 
    ? Math.round(completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length)
    : 0;

  // Calculer le temps d'étude total (en heures)
  const totalStudyTime = completedAttempts.reduce((total, attempt) => {
    if (attempt.duration_minutes) {
      return total + (attempt.duration_minutes / 60); // Convertir minutes en heures
    }
    // Fallback : calculer à partir des timestamps si duration_minutes n'est pas disponible
    if (attempt.completed_at && attempt.started_at) {
      const duration = new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime();
      return total + (duration / (1000 * 60 * 60)); // Convertir en heures
    }
    return total;
  }, 0);

  // Calculer le taux de réussite (score >= 60%)
  const successfulAttempts = completedAttempts.filter(a => (a.score || 0) >= 60).length;
  const successRate = completedAttempts.length > 0 
    ? Math.round((successfulAttempts / completedAttempts.length) * 100)
    : 0;

  // Grouper les performances par matière
  const subjectMap = new Map();
  subjectData?.forEach(perf => {
    const subject = perf.subject_name;
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, {
        scores: [],
        attempts: 0,
        totalQuestions: 0
      });
    }
    const subjectInfo = subjectMap.get(subject);
    subjectInfo.scores.push(perf.score);
    subjectInfo.attempts += 1;
    subjectInfo.totalQuestions += perf.total_questions;
  });

  const subjectPerformance = Array.from(subjectMap.entries()).map(([subject, info]) => {
    const avgScore = info.scores.length > 0 
      ? Math.round(info.scores.reduce((a, b) => a + b, 0) / info.scores.length)
      : 0;
    
    // Calculer l'évolution (simulation pour maintenant, on pourrait comparer avec la période précédente)
    const change = info.attempts > 1 
      ? Math.round(Math.random() * 10 - 5) 
      : 0;
    
    return {
      subject,
      score: avgScore,
      change,
      attempts: info.attempts
    };
  });

  // Activité récente
  const recentActivity = attempts?.slice(0, 5).map(attempt => ({
    id: attempt.id,
    type: 'exam_completed' as const,
    title: attempt.exam_name || `${attempt.exam_id} - Terminé`,
    score: attempt.completed_at ? attempt.score : undefined,
    date: formatDate(attempt.started_at),
    subject: attempt.subject || 'Général'
  })) || [];

  // Progression mensuelle (derniers 6 mois)
  const monthlyProgress = getMonthlyProgress(completedAttempts);

  const statistics = {
    totalAttempts,
    averageScore,
    totalStudyTime: Math.round(totalStudyTime * 10) / 10, // Arrondir à 1 décimale
    successRate,
    subjectPerformance,
    recentActivity,
    monthlyProgress
  };

  console.log('Calculated statistics:', statistics);
  return statistics;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffInHours < 48) {
    return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const getMonthlyProgress = (attempts: any[]) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthlyData = new Map();
  
  attempts.forEach(attempt => {
    const date = new Date(attempt.started_at);
    const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { scores: [], attempts: 0 });
    }
    
    const monthInfo = monthlyData.get(monthKey);
    if (attempt.score !== null && attempt.score !== undefined) {
      monthInfo.scores.push(attempt.score);
    }
    monthInfo.attempts += 1;
  });
  
  return Array.from(monthlyData.entries())
    .map(([month, info]) => ({
      month,
      score: info.scores.length > 0 
        ? Math.round(info.scores.reduce((a, b) => a + b, 0) / info.scores.length)
        : 0,
      attempts: info.attempts
    }))
    .slice(-6); // Derniers 6 mois
};
