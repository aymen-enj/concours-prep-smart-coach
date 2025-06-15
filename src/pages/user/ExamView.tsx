
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, ArrowLeft, ArrowRight, Flag, RotateCcw, User, BookOpen, Timer, Target } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MathRenderer from "@/components/MathRenderer";
import { useToast } from "@/hooks/use-toast";
import { loadExam } from "@/services/examService";
import type { ExamData, ExamQuestion } from "@/types/exam";
import { useExamTracking } from "@/hooks/useExamTracking";

// Interface pour une question adaptée à l'ExamView
interface Question {
  question_number: string;
  text: string;
  options: Record<string, string>;
  correct_answer: string;
  subject?: string;
  image?: string;
}

const ExamView = () => {
  const { school, year, subject, type } = useParams<{
    school: string;
    year: string;
    subject?: string;
    type?: string;
  }>();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startExam, saveAnswer, finishExam, isExamActive, getCurrentStats } = useExamTracking();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (!isExamActive) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isExamActive]);

  // Convert ExamData to Questions format
  const convertExamDataToQuestions = (data: ExamData): Question[] => {
    const allQuestions: Question[] = [];
    
    data.components.forEach(component => {
      component.questions.forEach(q => {
        // Convert options from ExamOption[] to Record<string, string>
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

  // Load exam data
  useEffect(() => {
    const initializeExam = async () => {
      if (!school || !year) {
        setError("Paramètres d'examen manquants");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const examId = `${school}-${year}`;
        
        // Load exam with optional subject
        const data = await loadExam(examId, subject);
        setExamData(data);

        // Convert to questions format
        const convertedQuestions = convertExamDataToQuestions(data);
        setQuestions(convertedQuestions);

        // Start tracking the exam
        const examSession = {
          examId: `${school}-${year}${subject ? `-${subject}` : ''}${type ? `-${type}` : ''}`,
          examName: data.exam_title || `${school.toUpperCase()} ${year}${subject ? ` - ${subject.toUpperCase()}` : ''}`,
          examType: type || 'general',
          subject: subject || 'general',
          totalQuestions: convertedQuestions.length
        };

        await startExam(examSession);
        setError(null);
      } catch (err) {
        console.error('Error loading exam:', err);
        setError("Erreur lors du chargement de l'examen");
        toast({
          title: "Erreur",
          description: "Impossible de charger l'examen",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeExam();
  }, [school, year, subject, type, startExam, toast]);

  const handleAnswerSelect = (questionIndex: number, optionKey: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionKey
    }));

    // Save the answer with tracking
    if (questions.length > 0) {
      const question = questions[questionIndex];
      const isCorrect = question.correct_answer === optionKey;
      
      saveAnswer({
        questionNumber: questionIndex + 1,
        selectedOption: optionKey,
        isCorrect,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        questionSubject: question.subject || subject || 'general'
      });
    }
  };

  const handleFinishExam = async () => {
    if (!questions.length) return;

    try {
      const success = await finishExam(questions.length);
      if (success) {
        toast({
          title: "Examen terminé",
          description: "Vos résultats ont été sauvegardés",
          variant: "default"
        });
        navigate(`/correction/${school}/${year}${subject ? `/${subject}` : ''}${type ? `/${type}` : ''}`, {
          state: { 
            selectedAnswers,
            examData,
            timeElapsed
          }
        });
      }
    } catch (error) {
      console.error('Error finishing exam:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Préparation de votre examen</h2>
            <p className="text-gray-600">Chargement des questions en cours...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !examData || !questions.length) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center shadow-lg border-0">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Flag className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Oups !</h2>
              <p className="text-gray-600 mb-6">{error || "Examen non trouvé"}</p>
              <Button onClick={() => navigate('/concours')} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4" />
                Retour aux concours
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const stats = getCurrentStats();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Header moderne avec informations d'examen */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {examData.exam_title}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
                </div>
                {currentQuestion.subject && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {currentQuestion.subject}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Timer className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-gray-700">{formatTime(timeElapsed)}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">{answeredQuestions}/{questions.length}</span>
              </div>

              {stats.answered > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-700 font-medium">{stats.score}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-gray-100" />
          </div>
        </div>
      </div>

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Question principale */}
            <div className="xl:col-span-3">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="font-bold">{currentQuestionIndex + 1}</span>
                      </div>
                      <span>Question {currentQuestionIndex + 1}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Texte de la question */}
                  <div className="prose prose-lg max-w-none">
                    <MathRenderer text={currentQuestion.text} />
                  </div>

                  {/* Image de la question */}
                  {currentQuestion.image && (
                    <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
                      <img 
                        src={currentQuestion.image} 
                        alt={`Question ${currentQuestionIndex + 1}`}
                        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  )}

                  {/* Options de réponse */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Choisissez votre réponse :</h3>
                    <RadioGroup
                      value={selectedAnswers[currentQuestionIndex] || ""}
                      onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
                      className="space-y-3"
                    >
                      {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <div 
                          key={key} 
                          className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 ${
                            selectedAnswers[currentQuestionIndex] === key 
                              ? 'bg-blue-50 border-blue-300 shadow-md' 
                              : 'bg-white border-gray-200 hover:shadow-sm'
                          }`}
                        >
                          <RadioGroupItem value={key} id={`option-${key}`} className="mt-1" />
                          <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <span className="font-semibold text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {key}
                              </span>
                              <div className="flex-1 pt-1">
                                <MathRenderer text={value} />
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar de navigation */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Grille de navigation des questions */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">#</span>
                      </div>
                      Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {questions.map((_, index) => (
                        <Button
                          key={index}
                          variant={index === currentQuestionIndex ? "default" : selectedAnswers[index] ? "secondary" : "outline"}
                          size="sm"
                          className={`h-10 w-10 p-0 text-sm font-medium transition-all duration-200 ${
                            index === currentQuestionIndex 
                              ? 'bg-blue-600 hover:bg-blue-700 scale-110 shadow-md' 
                              : selectedAnswers[index] 
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                : 'hover:border-blue-300 hover:bg-blue-50'
                          }`}
                          onClick={() => setCurrentQuestionIndex(index)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>

                    <Separator />

                    {/* Boutons de navigation */}
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 hover:bg-gray-50"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 hover:bg-gray-50"
                        disabled={currentQuestionIndex === questions.length - 1}
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      >
                        Suivant
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator />

                    {/* Actions d'examen */}
                    <div className="space-y-3">
                      <Button
                        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                        onClick={handleFinishExam}
                      >
                        <Flag className="h-4 w-4" />
                        Terminer l'examen
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => navigate('/concours')}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Abandonner
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Répondues:</span>
                        <span className="font-semibold text-gray-800">{answeredQuestions}/{questions.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600">Temps:</span>
                        <span className="font-mono font-semibold text-blue-800">{formatTime(timeElapsed)}</span>
                      </div>
                      {stats.answered > 0 && (
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-green-600">Score actuel:</span>
                          <span className="font-semibold text-green-800">{stats.score}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamView;
