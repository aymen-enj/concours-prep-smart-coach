
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { getUserStatistics, UserStatistics } from '@/services/statisticsService';

export const useUserStatistics = () => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
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

    fetchStatistics();
  }, [user]);

  const refreshStatistics = async () => {
    if (user) {
      try {
        const stats = await getUserStatistics(user.id);
        setStatistics(stats);
      } catch (err) {
        console.error('Error refreshing statistics:', err);
      }
    }
  };

  return {
    statistics,
    loading,
    error,
    refreshStatistics
  };
};
