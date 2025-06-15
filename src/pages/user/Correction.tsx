import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { MathRenderer } from '@/components/MathRenderer';
import { ImageRenderer } from '@/components/ImageRenderer';
import { ExamResultsPDF } from '@/components/ExamResultsPDF';
import { loadExam, getAllQuestionsForExam } from '@/services/examService';
import { ExamData, ExamQuestion } from '@/types/exam';

interface SubjectBreakdown {
  subject: string;
  correct: number;
  total: number;
  percentage: number;
}

interface DetailedAnswer {
  questionNumber: number;
  isCorrect: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
}

interface Results {
  correctCount: number;
  incorrectCount: number;
  score: number;
  subjectBreakdown: SubjectBreakdown[];
  detailedAnswers: DetailedAnswer[];
}

export default function Correction() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamAndAnswers = async () => {
      if (!examId) {
        setError('Exam ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const storedAnswers = localStorage.getItem(`userAnswers_${examId}`);
        if (!storedAnswers) {
          setError('No answers found for this exam.');
          setLoading(false);
          return;
        }

        const parsedAnswers = JSON.parse(storedAnswers);
        setUserAnswers(parsedAnswers);

        const exam = await loadExam(examId);
        setExamData(exam);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load exam data.');
        setLoading(false);
      }
    };

    fetchExamAndAnswers();
  }, [examId]);

  const calculateResults = (questions: ExamQuestion[], answers: Record<number, string | null>): Results => {
    let correctCount = 0;
    let incorrectCount = 0;
    const subjectCounts: Record<string, { correct: number; total: number }> = {};
    const detailedAnswers: DetailedAnswer[] = [];

    questions.forEach((question) => {
      const userAnswer = answers[question.question_number] || null;
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      // Subject Breakdown
      if (question.subject) {
        if (!subjectCounts[question.subject]) {
          subjectCounts[question.subject] = { correct: 0, total: 0 };
        }
        subjectCounts[question.subject].total++;
        if (isCorrect) {
          subjectCounts[question.subject].correct++;
        }
      }

      detailedAnswers.push({
        questionNumber: question.question_number,
        isCorrect: isCorrect,
        selectedAnswer: userAnswer,
        correctAnswer: question.correctAnswer || ''
      });
    });

    const score = (correctCount / questions.length) * 100;

    const subjectBreakdown: SubjectBreakdown[] = Object.entries(subjectCounts).map(([subject, counts]) => ({
      subject,
      correct: counts.correct,
      total: counts.total,
      percentage: (counts.correct / counts.total) * 100,
    }));

    return {
      correctCount,
      incorrectCount,
      score,
      subjectBreakdown,
      detailedAnswers,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error || !examData || !userAnswers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erreur lors du chargement des données'}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  const questions = getAllQuestionsForExam(examData);
  const results = calculateResults(questions, userAnswers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Correction et Résultats
            </h1>
            <p className="text-gray-600">
              {examData.title} - {examData.year}
            </p>
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Résumé des résultats</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.score.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Score global</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.correctCount}</div>
                <div className="text-sm text-gray-600">Bonnes réponses</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{results.incorrectCount}</div>
                <div className="text-sm text-gray-600">Erreurs</div>
              </div>
            </div>

            {/* PDF Download Section */}
            <ExamResultsPDF
              examData={{
                title: examData.title,
                year: examData.year,
                totalQuestions: questions.length,
                correctAnswers: results.correctCount,
                score: results.score,
                duration: examData.duration || '3 heures',
                subjectBreakdown: results.subjectBreakdown,
                detailedAnswers: results.detailedAnswers
              }}
            />
          </div>

          {/* Subject Breakdown */}
          {results.subjectBreakdown.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Répartition par matière</h2>
              <div className="space-y-4">
                {results.subjectBreakdown.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{subject.subject}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {subject.correct}/{subject.total}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {subject.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Corrections */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Correction détaillée</h2>
            
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.question_number];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.question_number} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">
                          Question {question.question_number}
                        </h3>
                        
                        <div className="mb-4">
                          <MathRenderer content={question.text} />
                        </div>

                        {question.image && (
                          <div className="mb-4">
                            <ImageRenderer src={question.image} alt={`Question ${question.question_number}`} />
                          </div>
                        )}

                        <div className="grid gap-2 mb-4">
                          {question.options.map((option, optIndex) => {
                            const isSelected = userAnswer === option.label;
                            const isCorrectOption = option.label === question.correctAnswer;
                            
                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded border ${
                                  isCorrectOption 
                                    ? 'bg-green-50 border-green-200' 
                                    : isSelected 
                                      ? 'bg-red-50 border-red-200' 
                                      : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${
                                    isCorrectOption 
                                      ? 'text-green-600' 
                                      : isSelected 
                                        ? 'text-red-600' 
                                        : 'text-gray-600'
                                  }`}>
                                    {option.label}.
                                  </span>
                                  <div className="flex-1">
                                    <MathRenderer content={option.text} />
                                  </div>
                                  {isSelected && (
                                    <span className="text-sm font-medium text-blue-600">
                                      Votre réponse
                                    </span>
                                  )}
                                  {isCorrectOption && (
                                    <span className="text-sm font-medium text-green-600">
                                      Bonne réponse
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <h4 className="font-medium text-blue-800 mb-2">Explication :</h4>
                            <div className="text-blue-700">
                              <MathRenderer content={question.explanation} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate('/dashboard')} className="px-6 py-2">
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
