import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock, AlertTriangle, CheckCircle, Info, HelpCircle, BrainCircuit, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Mock data for concours questions
const mockQuestions = [
  {
    id: "q1",
    type: "qcm",
    text: "Quelle est la limite de f(x) = (1+x)^(1/x) quand x tend vers 0 ?",
    options: ["e", "1", "0", "∞"],
    correctAnswer: "e",
    hint: "Pensez à la définition du nombre e comme une limite.",
    difficulty: "medium",
  },
  {
    id: "q2",
    type: "text",
    text: "Démontrez que la suite définie par u_n+1 = (u_n + a/u_n)/2 avec u_1 > 0 et a > 0 converge vers √a.",
    hint: "Cette méthode est connue sous le nom de méthode de Newton-Raphson.",
    difficulty: "hard",
  },
  {
    id: "q3",
    type: "qcm",
    text: "Dans un espace vectoriel normé, toute suite de Cauchy est :",
    options: [
      "Toujours convergente",
      "Convergente si l'espace est complet",
      "Jamais convergente",
      "Divergente",
    ],
    correctAnswer: "Convergente si l'espace est complet",
    hint: "La complétude d'un espace est liée au comportement des suites de Cauchy.",
    difficulty: "medium",
  },
  {
    id: "q4",
    type: "latex",
    text: "Calculez l'intégrale suivante : $\\int_{0}^{\\pi} \\sin(x) \\, dx$",
    hint: "Rappel : la primitive de sin(x) est -cos(x) + C",
    difficulty: "easy",
  },
  {
    id: "q5",
    type: "qcm",
    text: "Quelle est la solution de l'équation différentielle y' + y = 0 ?",
    options: [
      "y = Ce^x",
      "y = Ce^(-x)",
      "y = Cx",
      "y = C/x",
    ],
    correctAnswer: "y = Ce^(-x)",
    hint: "Une équation différentielle du premier ordre à coefficients constants.",
    difficulty: "medium",
  },
];

const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case "easy": return "text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    case "medium": return "text-amber-500 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
    case "hard": return "text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    default: return "text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
  }
};

const getDifficultyText = (difficulty) => {
  switch(difficulty) {
    case "easy": return "Facile";
    case "medium": return "Moyen";
    case "hard": return "Difficile";
    default: return "Non classé";
  }
};

const Concours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [showHint, setShowHint] = useState(false);
  
  // Mock concours data
  const concours = {
    id,
    title: "Concours CNC - Mathématiques",
    year: 2023,
    duration: "60 minutes",
    totalQuestions: mockQuestions.length,
  };

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
    if (currentQuestion < mockQuestions.length - 1) {
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
    console.log("Submitting answers:", answers);
    toast.success("Concours terminé! Vos réponses ont été soumises avec succès.");
    navigate(`/correction/${id}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const question = mockQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === mockQuestions.length - 1;
  const hasAnswer = !!answers[question.id];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-foreground">
                    {concours.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Année: {concours.year}</span>
                    <span>•</span>
                    <span>Durée: {concours.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {timeLeft < 300 && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Moins de 5 minutes
                  </Badge>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background shadow-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Question {currentQuestion + 1}/{concours.totalQuestions}</span>
                  <Badge className={cn("px-2 text-xs", getDifficultyColor(question.difficulty))}>
                    {getDifficultyText(question.difficulty)}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentQuestion + 1) / concours.totalQuestions * 100)}% terminé
                </span>
              </div>
              <Progress 
                value={(currentQuestion + 1) / concours.totalQuestions * 100} 
                className="h-2 bg-gray-100 dark:bg-gray-800" 
              />
            </div>

            <Card className="overflow-hidden border-border/40 bg-card/95 backdrop-blur-sm shadow-lg mb-6">
              <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h2 className="text-lg font-medium text-foreground">
                    {question.text}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => setShowHint(!showHint)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </div>

                {showHint && question.hint && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mb-6 flex items-start gap-3">
                    <div className="mt-0.5">
                      <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-amber-800 dark:text-amber-300 text-sm">{question.hint}</p>
                    </div>
                  </div>
                )}

                {question.type === "qcm" && (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswer(question.id, value)}
                    className="space-y-3"
                  >
                    {question.options?.map((option, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "flex items-center space-x-2 border border-border/60 rounded-lg p-3 transition-all",
                          answers[question.id] === option 
                            ? "border-primary/50 bg-primary/5" 
                            : "hover:border-border hover:bg-accent/5"
                        )}
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`}
                          className={cn(
                            "cursor-pointer flex-grow",
                            answers[question.id] === option ? "font-medium" : ""
                          )}
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {(question.type === "text" || question.type === "latex") && (
                  <Textarea
                    placeholder="Votre réponse ici..."
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="min-h-[160px] bg-background/50 border-border/60 focus-visible:ring-primary/30"
                  />
                )}
              </CardContent>
            </Card>

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
                  className="flex items-center gap-2 rounded-full"
                >
                  Suivant <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700"
                >
                  <Sparkles className="h-4 w-4" />
                  Terminer et soumettre
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Concours;
