
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, ArrowLeft, ArrowRight, Flag, RotateCcw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MathRenderer } from "@/components/MathRenderer";
import { ImageRenderer } from "@/components/ImageRenderer";
import { useToast } from "@/hooks/use-toast";
import { loadExamData } from "@/services/examService";
import type { ExamData, Question } from "@/types/exam";
import { useExamTracking } from "@/hooks/useExamTracking";

const ExamView = () => {
  const { school, year, subject, type } = useParams<{
    school: string;
    year: string;
    subject: string;
    type: string;
  }>();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startExam, saveAnswer, finishExam, isExamActive, getCurrentStats } = useExamTracking();

  const [examData, setExamData] = useState<ExamData | null>(null);
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

  // Load exam data
  useEffect(() => {
    const initializeExam = async () => {
      if (!school || !year || !subject) {
        setError("Paramètres d'examen manquants");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await loadExamData(school, year, subject, type);
        setExamData(data);

        // Start tracking the exam
        const examSession = {
          examId: `${school}-${year}-${subject}${type ? `-${type}` : ''}`,
          examName: data.title || `${school.toUpperCase()} ${year} - ${subject.toUpperCase()}`,
          examType: type || 'general',
          subject: subject,
          totalQuestions: data.questions.length
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
    if (examData) {
      const question = examData.questions[questionIndex];
      const isCorrect = question.correct_answer === optionKey;
      
      saveAnswer({
        questionNumber: questionIndex + 1,
        selectedOption: optionKey,
        isCorrect,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        questionSubject: question.subject || subject
      });
    }
  };

  const handleFinishExam = async () => {
    if (!examData) return;

    try {
      const success = await finishExam(examData.questions.length);
      if (success) {
        toast({
          title: "Examen terminé",
          description: "Vos résultats ont été sauvegardés",
          variant: "default"
        });
        navigate(`/correction/${school}/${year}/${subject}${type ? `/${type}` : ''}`, {
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
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de l'examen...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <Alert className="mb-4">
              <AlertDescription>
                {error || "Examen non trouvé"}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/concours')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux concours
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const stats = getCurrentStats();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header with exam info and timer */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{examData.title}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} sur {examData.questions.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {answeredQuestions}/{examData.questions.length}
              </Badge>

              {stats.answered > 0 && (
                <Badge variant="secondary">
                  Score: {stats.score}%
                </Badge>
              )}
            </div>
          </div>
          
          <Progress value={progress} className="mt-2" />
        </div>
      </div>

      <main className="flex-grow py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question {currentQuestionIndex + 1}</span>
                    {currentQuestion.subject && (
                      <Badge variant="outline">{currentQuestion.subject}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question text */}
                  <div className="prose prose-sm max-w-none">
                    <MathRenderer content={currentQuestion.question} />
                  </div>

                  {/* Question image */}
                  {currentQuestion.image && (
                    <div className="flex justify-center">
                      <ImageRenderer 
                        src={currentQuestion.image} 
                        alt={`Question ${currentQuestionIndex + 1}`}
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Answer options */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Choisissez votre réponse :</h3>
                    <RadioGroup
                      value={selectedAnswers[currentQuestionIndex] || ""}
                      onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
                    >
                      {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                          <RadioGroupItem value={key} id={`option-${key}`} className="mt-1" />
                          <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{key}.</span>
                              <div className="flex-1">
                                <MathRenderer content={value} />
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

            {/* Navigation sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Question grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {examData.questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={index === currentQuestionIndex ? "default" : selectedAnswers[index] ? "secondary" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>

                  <Separator />

                  {/* Navigation buttons */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      disabled={currentQuestionIndex === examData.questions.length - 1}
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(examData.questions.length - 1, prev + 1))}
                    >
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2"
                      onClick={handleFinishExam}
                    >
                      <Flag className="h-4 w-4" />
                      Terminer l'examen
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => navigate('/concours')}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Abandonner
                    </Button>
                  </div>

                  {/* Stats summary */}
                  <Separator />
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Répondues:</span>
                      <span>{answeredQuestions}/{examData.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temps:</span>
                      <span>{formatTime(timeElapsed)}</span>
                    </div>
                    {stats.answered > 0 && (
                      <div className="flex justify-between">
                        <span>Score actuel:</span>
                        <span>{stats.score}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamView;
