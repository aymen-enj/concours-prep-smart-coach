
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateAcademicExamPDF, PdfExamResult } from '@/services/academicPdfService';
import { toast } from 'sonner';

interface ExamResultsPDFProps {
  examData: {
    title: string;
    year: number;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    duration: string;
    timeTaken?: string;
    subjectBreakdown: Array<{
      subject: string;
      score: number;
      total: number;
      percentage: number;
    }>;
    detailedAnswers: Array<{
      questionNumber: number;
      subject: string;
      isCorrect: boolean;
      selectedAnswer: string;
      correctAnswer: string;
      timeSpent?: number;
    }>;
  };
  studentName?: string;
}

export const ExamResultsPDF: React.FC<ExamResultsPDFProps> = ({ 
  examData, 
  studentName 
}) => {
  const handleDownloadPDF = async () => {
    try {
      const pdfData: PdfExamResult = {
        examTitle: examData.title,
        examYear: examData.year,
        examDate: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        studentName,
        totalQuestions: examData.totalQuestions,
        correctAnswers: examData.correctAnswers,
        score: examData.score,
        duration: examData.duration,
        timeTaken: examData.timeTaken,
        subjectBreakdown: examData.subjectBreakdown,
        detailedAnswers: examData.detailedAnswers
      };

      const pdf = generateAcademicExamPDF(pdfData);
      
      // Generate filename
      const filename = `Resultats_${examData.title.replace(/\s+/g, '_')}_${examData.year}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
      
      toast.success('PDF téléchargé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Rapport de Résultats
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Téléchargez un rapport détaillé de vos performances avec analyse et recommandations
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md text-sm">
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700">Score</div>
          <div className="text-xl font-bold text-blue-600">{examData.score.toFixed(1)}%</div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700">Questions</div>
          <div className="text-xl font-bold text-green-600">
            {examData.correctAnswers}/{examData.totalQuestions}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleDownloadPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Download size={20} />
        Télécharger le Rapport PDF
      </Button>
      
      <div className="text-xs text-gray-500 text-center">
        Le rapport inclut : analyse détaillée, répartition par matière, <br />
        recommandations personnalisées et détail des réponses
      </div>
    </div>
  );
};
