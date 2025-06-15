
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { getUserStatistics, UserStatistics } from '@/services/statisticsService';

export const useUserStatistics = () => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStatistics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const stats = await getUserStatistics(user.id);
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [user]);

  // Écouter les événements d'examen terminé
  useEffect(() => {
    const handleExamCompleted = () => {
      console.log('Exam completed event received, refreshing statistics...');
      fetchStatistics();
    };

    window.addEventListener('examCompleted', handleExamCompleted);
    return () => window.removeEventListener('examCompleted', handleExamCompleted);
  }, [user]);

  const refreshStatistics = async () => {
    await fetchStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refreshStatistics
  };
};
