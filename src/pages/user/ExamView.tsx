import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock, AlertTriangle, CheckCircle, Info, HelpCircle, BrainCircuit, Sparkles, BookOpen, LightbulbIcon, Brain, ChevronDown } from "lucide-react";
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

interface StimulusListItem {
  number: number;
  text: string;
}

interface TableData {
  type: "table";
  headers: string[];
  rows: (string | number)[][];
  description?: string;
  columns?: string[];
  additional_data_for_Q23?: string;
}

interface ResultsData {
  type: "results";
  observations: { case: number; result: string }[];
}

interface SimpleData {
  given_values?: string[];
  remark?: string;
  [key: string]: any; // For other data fields
}

interface ExamQuestion {
  question_number: string;
  text: string;
  options: ExamOption[];
  stimulus?: string;
  stimulus_list?: StimulusListItem[];
  data?: TableData | ResultsData | SimpleData;
  follow_up_question?: string;
  image_description?: string;
  data_labels_from_image?: string[];
  exercise_title?: string;
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

  // State for quick navigation component visibility (moved outside the component to persist between renders)
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>(() => {
    // Initialize with first component expanded
    const initialState: Record<string, boolean> = {};
    if (medecine2023Data.components.length > 0) {
      initialState[medecine2023Data.components[0].component_name] = true;
    }
    return initialState;
  });

  // Quick navigation to questions organized by component
  const QuickNav = () => {
    // Group questions by component
    const questionsByComponent = useMemo(() => {
      const result: Record<string, { component: ExamComponent, questionIndices: number[] }> = {};
      
      let questionIndex = 0;
      medecine2023Data.components.forEach((component) => {
        // Create entry for this component if it doesn't exist
        if (!result[component.component_name]) {
          result[component.component_name] = {
            component,
            questionIndices: []
          };
        }
        
        // Add question indices for this component
        component.questions.forEach(() => {
          result[component.component_name].questionIndices.push(questionIndex);
          questionIndex++;
        });
      });
      
      return result;
    }, []);
    
    // Handler to toggle component expansion
    const handleToggleComponent = useCallback((e: React.MouseEvent, componentName: string) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Toggling component:', componentName, 'Current state:', expandedComponents[componentName]);
      
      // Using a timeout to ensure this doesn't get caught in a React batched update
      // This helps ensure the state change persists
      setTimeout(() => {
        setExpandedComponents(prev => {
          const newState = {
            ...prev,
            [componentName]: !prev[componentName]
          };
          console.log('New state:', newState);
          return newState;
        });
      }, 0);
    }, [expandedComponents]);
    
    return (
      <div className="hidden md:flex flex-col gap-2 mb-6">
        {Object.entries(questionsByComponent).map(([componentName, { component, questionIndices }]) => (
          <div key={componentName} className="border rounded-md overflow-hidden">
            {/* Component header - clickable to expand/collapse */}
            <div 
              className="bg-muted/50 px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-muted transition-colors"
              onClick={(e) => handleToggleComponent(e, componentName)}
            >
              <div className="font-medium">{componentName}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{questionIndices.length} questions</Badge>
                <ChevronDown className={cn("h-4 w-4 transition-transform", expandedComponents[componentName] ? "rotate-180" : "")} />
              </div>
            </div>
            
            {/* Questions for this component - only shown when expanded */}
            {expandedComponents[componentName] && (
              <div className="p-2 flex flex-wrap gap-1 bg-background">
                {questionIndices.map((index) => {
                  const question = allQuestions[index];
                  return (
                    <TooltipProvider key={`nav-${index}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                              "h-6 w-6 rounded-full transition-all text-xs",
                              currentQuestion === index 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                : answers[question?.question_number || ''] 
                                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40" 
                                  : "bg-background"
                            )}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event from propagating to parent
                              setCurrentQuestion(index);
                            }}
                          >
                            {index + 1}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" onClick={(e) => e.stopPropagation()}>
                          <div className="text-xs">
                            <div className="font-semibold">Question {index + 1}</div>
                            <div className="truncate max-w-48">{question.text}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-0 w-120 h-120 bg-blue-400/8 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-amber-400/8 blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full bg-green-400/8 blur-3xl -z-10 animate-pulse-slow"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg ring-4 ring-primary/20 animate-pulse-slow">
                  <BrainCircuit className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-foreground">
                    {examData.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>Année: {examData.year}</span>
                    <span>•</span>
                    <span>Durée: {examData.duration}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">Vous progressez bien!</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {timeLeft < 300 && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none gap-1 animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    Moins de 5 minutes
                  </Badge>
                )}
                {timeLeft > 300 && timeLeft < 1800 && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none gap-1">
                    <Clock className="h-3 w-3" />
                    Dernière demi-heure
                  </Badge>
                )}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 bg-background shadow-md hover:shadow-lg transition-all",
                  timeLeft < 300 && "border-red-300 bg-red-50 dark:bg-red-950/10 dark:border-red-800/50"
                )}>
                  <Clock className={cn("h-5 w-5", timeLeft < 300 ? "text-red-500" : "text-primary")} />
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                    Question {currentQuestion + 1}/{examData.totalQuestions}
                  </div>
                  <Badge className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30">
                    QCM
                  </Badge>
                  {Object.keys(answers).length > 0 && (
                    <Badge className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {Object.keys(answers).length} réponse{Object.keys(answers).length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {progressPercentage >= 25 && progressPercentage < 50 && (
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Continuez, bon début !
                    </span>
                  )}
                  {progressPercentage >= 50 && progressPercentage < 75 && (
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Vous êtes à mi-chemin !
                    </span>
                  )}
                  {progressPercentage >= 75 && (
                    <span className="text-sm font-medium text-primary">
                      Presque terminé !
                    </span>
                  )}
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
                    {Math.round(progressPercentage)}% terminé
                  </span>
                </div>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-1000 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                {/* Progress markers for 25%, 50%, and 75% */}
                <div className="absolute top-0 left-1/4 h-full w-0.5 bg-white/50 dark:bg-white/20"></div>
                <div className="absolute top-0 left-1/2 h-full w-0.5 bg-white/50 dark:bg-white/20"></div>
                <div className="absolute top-0 left-3/4 h-full w-0.5 bg-white/50 dark:bg-white/20"></div>
              </div>
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
                <Card className="overflow-hidden border-border/40 bg-card/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 mb-8 rounded-xl">
                  <div className="h-2 bg-gradient-to-r from-primary to-blue-600"></div>
                  <CardContent className="p-8 text-base">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex gap-3 flex-grow">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-base font-medium text-primary">{question.question_number}</span>
                        </div>
                        <div className="w-full">
                          {question.exercise_title && (
                            <div className="mb-3 text-base text-foreground font-medium">
                              {question.exercise_title}
                            </div>
                          )}
                          
                          {question.stimulus && (
                            <div className="mb-5 p-4 bg-muted/50 rounded-lg border border-border/50">
                              <h3 className="text-base font-medium mb-2 text-primary">Contexte:</h3>
                              <div className="text-base text-foreground leading-relaxed" style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
                                <MathRenderer text={question.stimulus} />
                              </div>
                            </div>
                          )}
                          
                          {question.stimulus_list && (
                            <div className="mb-4 p-3 bg-muted/50 rounded-md border border-border/50">
                              <h3 className="text-sm font-medium mb-1">Éléments à considérer:</h3>
                              <ul className="list-none space-y-1">
                                {question.stimulus_list.map((item) => (
                                  <li key={item.number} className="text-sm">
                                    <span className="font-medium mr-2">{item.number}.</span>
                                    <MathRenderer text={item.text} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {question.data && (
                            <div className="mb-4 p-3 bg-muted/50 rounded-md border border-border/50">
                              <h3 className="text-sm font-medium mb-2">Données:</h3>
                              
                              {/* Table data */}
                              {'type' in question.data && question.data.type === 'table' && (
                                <div className="overflow-x-auto w-full max-w-full my-4">
                                  <div className="inline-block min-w-full align-middle">
                                    <table className="text-sm" style={{borderCollapse: 'collapse', borderWidth: '1px', borderStyle: 'solid', borderColor: '#000', width: '100%', tableLayout: 'fixed'}}>
                                      {question.data.headers && (
                                        <thead>
                                          <tr>
                                            {question.data.headers.map((header, idx) => (
                                              <th 
                                                key={idx} 
                                                style={{ 
                                                  borderWidth: '1px', 
                                                  borderStyle: 'solid',
                                                  borderColor: '#000',
                                                  padding: '4px 6px',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                  width: idx === 0 ? '20%' : idx === 1 ? '60%' : '20%'
                                                }}
                                              >
                                                <MathRenderer text={header} />
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                      )}
                                      <tbody>
                                        {question.data.rows && question.data.rows.map((row, rowIdx) => (
                                          <tr key={rowIdx}>
                                            {row.map((cell, cellIdx) => (
                                              <td 
                                                key={cellIdx} 
                                                style={{ 
                                                  borderWidth: '1px', 
                                                  borderStyle: 'solid',
                                                  borderColor: '#000',
                                                  padding: '4px 6px',
                                                  textAlign: cellIdx === 0 ? 'left' : cellIdx === 2 ? 'center' : 'center',
                                                  verticalAlign: 'middle',
                                                  height: '60px',
                                                  width: cellIdx === 0 ? '20%' : cellIdx === 1 ? '60%' : '20%',
                                                  overflowWrap: 'break-word'
                                                }}
                                              >
                                                <div style={{width: '100%', fontSize: cellIdx === 1 ? '90%' : '100%'}}>
                                                  <MathRenderer text={String(cell)} />
                                                </div>
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  {question.data.description && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                      {question.data.description}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Results data */}
                              {'type' in question.data && question.data.type === 'results' && (
                                <div className="space-y-2">
                                  {question.data.observations && question.data.observations.map((obs, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <div className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium">
                                        Case {obs.case}
                                      </div>
                                      <div className="text-sm">
                                        <MathRenderer text={obs.result} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Chemical Data - Conductivites molaires ioniques */}
                              {question.data.conductivites_molaires_ioniques && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium mb-2">Conductivités molaires ioniques:</h4>
                                  <Card className="overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead className="bg-muted/50">
                                        <tr>
                                          <th className="p-2 px-4 text-left font-medium border-b">Ion</th>
                                          <th className="p-2 px-4 text-right font-medium border-b">λ (mS.m².mol⁻¹)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {question.data.conductivites_molaires_ioniques.map((item: any, index: number) => (
                                          <tr key={index} className="border-b last:border-b-0 border-border/30 hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-medium">
                                              <MathRenderer text={item.ion} block={false} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                              <MathRenderer text={item.lambda} block={false} />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </Card>
                                </div>
                              )}

                              {/* Calculations - Calculs fournis */}
                              {question.data.calculs_fournis && (
                                <div className="mt-3 mb-3">
                                  <h4 className="text-sm font-medium mb-2">Calculs fournis:</h4>
                                  <Card className="bg-white dark:bg-gray-800 border border-border/50">
                                    <CardContent className="p-4 flex flex-col items-center">
                                      {question.data.calculs_fournis.map((calc: string, index: number) => (
                                        <div key={index} className="my-2 py-1 w-full text-center px-2 rounded-md bg-blue-50/50 dark:bg-blue-900/10">
                                          <MathRenderer text={calc} block={true} />
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </div>
                              )}

                              {/* Notes section */}
                              {question.data.note && (
                                <div className="mt-3 text-sm italic bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-md border border-amber-100 dark:border-amber-800/20">
                                  <span className="font-medium">Note: </span>
                                  <MathRenderer text={question.data.note} />
                                </div>
                              )}
                              
                              {/* Simple data with given values and remarks */}
                              {question.data.given_values && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-medium">Valeurs données:</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {question.data.given_values.map((value, idx) => (
                                      <li key={idx} className="text-sm">
                                        <MathRenderer text={value} />
                                      </li>
                                    ))}
                                  </ul>
                                  {question.data.remark && (
                                    <div className="mt-2 text-xs italic text-muted-foreground">
                                      Note: {question.data.remark}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Other data fields */}
                              {'type' in question.data === false && 
                               !question.data.given_values && 
                               !question.data.conductivites_molaires_ioniques &&
                               !question.data.calculs_fournis &&
                               !question.data.note &&
                               Object.keys(question.data).length > 0 && (
                                <div className="space-y-2">
                                  {Object.entries(question.data).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                      <span className="font-medium">{key}: </span>
                                      <MathRenderer text={typeof value === 'string' ? value : JSON.stringify(value)} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {question.image_description && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800/30 text-sm">
                              <div className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>
                                  <span className="font-medium">Description de l'image: </span>
                                  {question.image_description}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {question.data_labels_from_image && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800/30">
                              <h3 className="text-xs font-medium mb-1 text-blue-700 dark:text-blue-400">Légende de l'image:</h3>
                              <div className="flex flex-wrap gap-2">
                                {question.data_labels_from_image.map((label, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30">
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <h2 className="text-xl font-medium text-foreground mb-3 leading-relaxed">
                            <MathRenderer text={question.text} />
                          </h2>
                          
                          {question.follow_up_question && (
                            <div className="text-sm font-medium text-foreground mb-4">
                              <MathRenderer text={question.follow_up_question} />
                            </div>
                          )}
                        </div>
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
                              "flex items-center space-x-4 border border-border/60 rounded-lg p-4 transition-all",
                              answers[question.question_number] === option.label 
                                ? "border-primary/60 bg-primary/5 shadow-md" 
                                : "hover:border-border hover:bg-accent/5"
                            )}
                          >
                            <RadioGroupItem value={option.label} id={`option-${option.label}`} />
                            <Label 
                              htmlFor={`option-${option.label}`}
                              className={cn(
                                "cursor-pointer flex-grow text-base",
                                answers[question.question_number] === option.label ? "font-medium" : ""
                              )}
                            >
                              <span className="font-semibold mr-3 text-primary">{option.label}.</span>
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

            {/* Enhanced navigation and motivational card */}
            <div className="space-y-6">
              {/* Motivational card */}
              <Card className="overflow-hidden border-border/40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {progressPercentage < 30 ? (
                      <>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                          <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Excellent démarrage ! Chaque question vous rapproche du succès.
                        </p>
                      </>
                    ) : progressPercentage < 60 ? (
                      <>
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                          Beau travail ! Vous avez déjà complété {Math.round(progressPercentage)}% de l'examen !
                        </p>
                      </>
                    ) : progressPercentage < 90 ? (
                      <>
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                          <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          Vous êtes sur la bonne voie ! Continuez sur cette lancée, plus que {allQuestions.length - currentQuestion - 1} questions.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-primary">
                          La ligne d'arrivée est en vue ! Vous avez presque terminé l'examen !
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced navigation buttons */}
              <div className="flex justify-between items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 py-6 px-5 rounded-xl border-border/40 hover:bg-primary/5 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Retour</span>
                    <span className="font-medium">Question précédente</span>
                  </div>
                </Button>
                
                <div className="flex-1 text-center hidden md:block">
                  {hasAnswer ? (
                    <div className="flex flex-col items-center justify-center gap-1 bg-green-50 dark:bg-green-950/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800/30">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Réponse enregistrée</span>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-500">Vous pouvez passer à la question suivante</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 bg-amber-50 dark:bg-amber-950/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800/30">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">N'oubliez pas de répondre avant de continuer</span>
                      <span className="text-xs text-amber-500 dark:text-amber-500">Sélectionnez une option pour avancer</span>
                    </div>
                  )}
                </div>

                {!isLastQuestion ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2 py-6 px-5 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-primary-foreground/80">Continuer</span>
                      <span className="font-medium">Question suivante</span>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 py-6 px-5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-600/90 hover:to-emerald-600/90 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-primary-foreground/80">Patientez</span>
                          <span className="font-medium">Envoi en cours...</span>
                        </div>
                        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-1"></span>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-primary-foreground/80">Bravo !</span>
                          <span className="font-medium">Terminer l'examen</span>
                        </div>
                        <Sparkles className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamView;
