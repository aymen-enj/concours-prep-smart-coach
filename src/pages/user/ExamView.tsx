import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock, AlertTriangle, CheckCircle, Info, HelpCircle, BrainCircuit, Sparkles, BookOpen, LightbulbIcon, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MathRenderer from "@/components/MathRenderer";

// Import exam data with proper TypeScript typing
import medecine2023Data from "../../../concours/medecine/medecine2023/epreuve_2023.json";

// Types for the exam data matching the actual JSON structure
interface ExamOption {
  label: string;
  text: string;
}

interface ExamQuestion {
  question_number: string;
  text: string;
  options: ExamOption[];
}

interface ExamComponent {
  component_name: string;
  coefficient: number;
  questions: ExamQuestion[];
}

interface ExamData {
  exam_title: string;
  components: ExamComponent[];
}

// Helper functions
const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case "easy": return "text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    case "medium": return "text-amber-500 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
    case "hard": return "text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    default: return "text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
  }
};

const getDifficultyText = (difficulty: string) => {
  switch(difficulty) {
    case "easy": return "Facile";
    case "medium": return "Moyen";
    case "hard": return "Difficile";
    default: return "Non classé";
  }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const ExamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours in seconds
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Flatten all questions from all components
  const allQuestions = useMemo(() => {
    return medecine2023Data.components.flatMap(component => component.questions);
  }, []);
  
  // Process exam data
  const examData = useMemo(() => {
    return {
      id: id || 'medecine2023',
      title: medecine2023Data.exam_title || 'Concours de Médecine 2023',
      year: 2023, // Hardcoded since it's in the path
      duration: '3 heures', // Hardcoded since it's not in the JSON
      totalQuestions: allQuestions.length,
    };
  }, [id, allQuestions.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowHint(false);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would send the answers to a server
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting answers:", answers);
      toast.success("Concours terminé! Vos réponses ont été soumises avec succès.");
      navigate(`/correction/${id}`);
    }, 1500);
  };

  // Current question data
  const question = allQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === allQuestions.length - 1;
  const hasAnswer = !!answers[question.question_number];

  // Calculate progress percentage
  const progressPercentage = (currentQuestion + 1) / examData.totalQuestions * 100;

  // Quick navigation to questions
  const QuickNav = () => (
    <div className="hidden md:flex items-center gap-2 mb-8 flex-wrap">
      {allQuestions.slice(0, 20).map((q, index) => (
        <TooltipProvider key={q.question_number}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full transition-all",
                  currentQuestion === index 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : answers[q.question_number] 
                      ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40" 
                      : "bg-background"
                )}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="text-xs">
                <div className="font-semibold">Question {index + 1}</div>
                <div className="px-1.5 py-0.5 rounded text-[10px] mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  QCM
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {allQuestions.length > 20 && (
        <div className="text-sm text-muted-foreground">
          +{allQuestions.length - 20} questions
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-amber-400/5 blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-foreground">
                    {examData.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Année: {examData.year}</span>
                    <span>•</span>
                    <span>Durée: {examData.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {timeLeft < 300 && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none gap-1 animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    Moins de 5 minutes
                  </Badge>
                )}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background shadow-sm",
                  timeLeft < 300 && "border-red-300 bg-red-50 dark:bg-red-950/10 dark:border-red-800/50"
                )}>
                  <Clock className={cn("h-4 w-4", timeLeft < 300 ? "text-red-500" : "text-primary")} />
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Question {currentQuestion + 1}/{examData.totalQuestions}</span>
                  <Badge className="px-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    QCM
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% terminé
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-gray-100 dark:bg-gray-800" 
              />
            </div>

            {/* Quick navigation */}
            <QuickNav />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-border/40 bg-card/95 backdrop-blur-sm shadow-lg mb-6">
                  <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-medium text-primary">{question.question_number}</span>
                        </div>
                        <h2 className="text-lg font-medium text-foreground">
                          <MathRenderer text={question.text} />
                        </h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => setShowHint(!showHint)}
                      >
                        <LightbulbIcon className={cn("h-5 w-5", showHint && "text-amber-500")} />
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showHint && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mb-6 flex items-start gap-3 overflow-hidden"
                        >
                          <div className="mt-0.5">
                            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-amber-800 dark:text-amber-300 text-sm">
                              Pas d'indice disponible pour cette question.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <RadioGroup
                      value={answers[question.question_number] || ""}
                      onValueChange={(value) => handleAnswer(question.question_number, value)}
                      className="space-y-3"
                    >
                      {question.options.map((option, index) => (
                        <motion.div
                          key={option.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div 
                            className={cn(
                              "flex items-center space-x-3 border border-border/60 rounded-lg p-3 transition-all",
                              answers[question.question_number] === option.label 
                                ? "border-primary/50 bg-primary/5 shadow-sm" 
                                : "hover:border-border hover:bg-accent/5"
                            )}
                          >
                            <RadioGroupItem value={option.label} id={`option-${option.label}`} />
                            <Label 
                              htmlFor={`option-${option.label}`}
                              className={cn(
                                "cursor-pointer flex-grow",
                                answers[question.question_number] === option.label ? "font-medium" : ""
                              )}
                            >
                              <span className="font-medium mr-2">{option.label}.</span>
                              <MathRenderer text={option.text} />
                            </Label>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 rounded-full border-border/40 hover:bg-primary/5 hover:border-primary/30"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </Button>
              
              <div className="flex-1 mx-4 text-center text-sm text-muted-foreground hidden sm:block">
                {hasAnswer ? (
                  <span className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Réponse enregistrée
                  </span>
                ) : (
                  <span className="text-amber-500">N'oubliez pas de répondre avant de continuer</span>
                )}
              </div>

              {!isLastQuestion ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-primary"
                >
                  Suivant <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-600 hover:to-green-600"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Terminer et soumettre
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamView;
