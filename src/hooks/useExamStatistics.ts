
import { useCallback } from 'react';
import { useUserStatistics } from '@/hooks/useUserStatistics';

export const useExamStatistics = () => {
  const { statistics, loading, error, refreshStatistics } = useUserStatistics();

  const refreshAfterExam = useCallback(async () => {
    // Attendre un peu pour que les données soient bien sauvegardées
    setTimeout(async () => {
      await refreshStatistics();
    }, 1000);
  }, [refreshStatistics]);

  return {
    statistics,
    loading,
    error,
    refreshStatistics,
    refreshAfterExam
  };
};
