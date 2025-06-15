
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, XCircle, Clock, Target, BookOpen, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MathRenderer from "@/components/MathRenderer";
import { loadExam } from "@/services/examService";
import type { ExamData } from "@/types/exam";

const Correction = () => {
  const { school, year, subject, type } = useParams<{
    school: string;
    year: string;
    subject?: string;
    type?: string;
  }>();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données depuis l'état de navigation si disponibles
  useEffect(() => {
    if (location.state) {
      const { selectedAnswers: stateAnswers, examData: stateExamData, timeElapsed: stateTime } = location.state;
      if (stateAnswers) setSelectedAnswers(stateAnswers);
      if (stateExamData) setExamData(stateExamData);
      if (stateTime) setTimeElapsed(stateTime);
    }
  }, [location.state]);

  // Charger les données d'examen si pas disponibles dans l'état
  useEffect(() => {
    const loadExamData = async () => {
      if (!school || !year) {
        setError("Paramètres d'examen manquants");
        setIsLoading(false);
        return;
      }

      if (examData) {
        setIsLoading(false);
        return; // Données déjà chargées depuis l'état
      }

      try {
        setIsLoading(true);
        const examId = `${school}-${year}`;
        console.log('Loading exam for correction:', examId, subject);
        
        const data = await loadExam(examId, subject);
        setExamData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading exam for correction:', err);
        setError("Erreur lors du chargement de l'examen");
      } finally {
        setIsLoading(false);
      }
    };

    loadExamData();
  }, [school, year, subject, examData]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert ExamData to Questions format for displaying
  const convertExamDataToQuestions = (data: ExamData) => {
    const allQuestions: any[] = [];
    
    data.components.forEach(component => {
      component.questions.forEach(q => {
        const options: Record<string, string> = {};
        if (q.options) {
          q.options.forEach(option => {
            options[option.label] = option.text;
          });
        }

        allQuestions.push({
          question_number: q.question_number,
          text: q.text,
          options,
          correct_answer: q.correctAnswer || 'A',
          subject: q.subject || component.component_name,
          image: q.programmatic_figure?.image_url
        });
      });
    });

    return allQuestions;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Chargement de la correction</h2>
            <p className="text-gray-600">Préparation de vos résultats...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center shadow-lg border-0">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur lors du chargement</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => navigate('/concours')} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4" />
                Retour aux examens
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const questions = convertExamDataToQuestions(examData);
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const correctAnswers = Object.entries(selectedAnswers).filter(([index, answer]) => {
    const questionIndex = parseInt(index);
    return questions[questionIndex]?.correct_answer === answer;
  }).length;
  
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Header avec résultats */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Correction - {examData.exam_title}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{totalQuestions} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Temps: {formatTime(timeElapsed)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-2xl font-bold text-green-600">{score}%</div>
                <div className="text-sm text-green-600 font-medium">Score final</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{correctAnswers}/{totalQuestions}</div>
                <div className="text-sm text-blue-600 font-medium">Bonnes réponses</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={(correctAnswers / totalQuestions) * 100} className="h-3 bg-gray-100" />
          </div>
        </div>
      </div>

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <Card key={index} className={`shadow-lg border-l-4 ${
                  !wasAnswered ? 'border-l-gray-400 bg-gray-50' :
                  isCorrect ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          !wasAnswered ? 'bg-gray-400' :
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {!wasAnswered ? (
                            <span className="text-white text-sm font-bold">?</span>
                          ) : isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <XCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span>Question {index + 1}</span>
                      </CardTitle>
                      
                      <div className="flex items-center gap-2">
                        {question.subject && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {question.subject}
                          </Badge>
                        )}
                        <Badge variant={!wasAnswered ? 'secondary' : isCorrect ? 'default' : 'destructive'}>
                          {!wasAnswered ? 'Non répondue' : isCorrect ? 'Correcte' : 'Incorrecte'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Question text */}
                    <div className="prose prose-lg max-w-none">
                      <MathRenderer text={question.text} />
                    </div>

                    {/* Question image */}
                    {question.image && (
                      <div className="flex justify-center p-4 bg-white rounded-xl border">
                        <img 
                          src={question.image} 
                          alt={`Question ${index + 1}`}
                          className="max-w-full h-auto rounded-lg shadow-md"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                      {Object.entries(question.options).map(([key, value]) => {
                        const isUserAnswer = userAnswer === key;
                        const isCorrectAnswer = question.correct_answer === key;
                        
                        return (
                          <div 
                            key={key} 
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isCorrectAnswer && isUserAnswer 
                                ? 'bg-green-100 border-green-300' 
                                : isCorrectAnswer 
                                  ? 'bg-green-50 border-green-200' 
                                  : isUserAnswer 
                                    ? 'bg-red-100 border-red-300' 
                                    : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`font-semibold w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                isCorrectAnswer && isUserAnswer 
                                  ? 'bg-green-200 text-green-800' 
                                  : isCorrectAnswer 
                                    ? 'bg-green-100 text-green-700' 
                                    : isUserAnswer 
                                      ? 'bg-red-200 text-red-800' 
                                      : 'bg-gray-100 text-gray-600'
                              }`}>
                                {key}
                              </span>
                              <div className="flex-1 pt-1">
                                <MathRenderer text={value} />
                              </div>
                              <div className="flex items-center gap-2">
                                {isUserAnswer && (
                                  <Badge variant="outline" className="text-xs">
                                    Votre réponse
                                  </Badge>
                                )}
                                {isCorrectAnswer && (
                                  <Badge className="text-xs bg-green-600">
                                    Bonne réponse
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Actions en bas */}
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/concours')} 
              variant="outline" 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux examens
            </Button>
            <Button 
              onClick={() => navigate('/statistiques')} 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4" />
              Voir mes statistiques
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Correction;
