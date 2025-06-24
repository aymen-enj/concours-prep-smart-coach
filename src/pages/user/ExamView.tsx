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
import PlotRenderer from "@/components/PlotRenderer";
import DiagramRenderer from "@/components/DiagramRenderer";
import RawSvgRenderer from "@/components/RawSvgRenderer";
import SvgFileRenderer from "@/components/SvgFileRenderer";
import ImageRenderer from "@/components/ImageRenderer";
import { loadExam } from "@/services/examService";

// Remove hardcoded import and add dynamic loading
// import medecine2022Data from "../../../concours/medecine/medecine2022/epreuve_2022.json";

// Types for the exam data matching the actual JSON structure
interface ExamOption {
  label: string;
  text: string;
  is_input?: boolean; // Ajout pour permettre les champs de saisie
  programmatic_figure?: {
    type: 'image';
    library: string;
    image_url: string;
    alt_text?: string;
    [key: string]: any;
  };
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
  pK_a1?: string;
  pK_a2?: string;
  [key: string]: any; // For other data fields
}

interface ExamQuestion {
  question_number: string;
  text: string;
  options: ExamOption[];
  programmatic_figure?: {
    type: 'plot' | 'diagram' | 'raw_svg' | 'svg_file' | 'image';
    library: string;
    title?: string;
    svg_content?: string; // For raw SVG content
    svg_url?: string;     // For SVG file URL
    data_points?: Array<{
      distance: number;
      phosphocreatine: number;
      atp: number;
      acideLactique: number;
      [key: string]: number;
    }>;
    annotations?: Array<{
      text: string;
      x: number;
      y: number;
      textAnchor?: 'start' | 'middle' | 'end';
    }>;
    [key: string]: any;
  };
  programmatic_figures?: {
    type: 'plot' | 'diagram';
    library: string;
    title: string;
    data_points?: Array<{
      distance: number;
      phosphocreatine: number;
      atp: number;
      acideLactique: number;
      [key: string]: number;
    }>;
    annotations?: Array<{
      text: string;
      x: number;
      y: number;
      textAnchor?: 'start' | 'middle' | 'end';
    }>;
    [key: string]: any;
  }[];
  stimulus?: string;
  stimulus_list?: Array<{ number: number; text: string; }>;
  follow_up_question?: string;
  image_description?: string;
  data_labels_from_image?: string[];
  data?: {
    type?: 'table' | 'results' | 'simple';
    columns?: string[];
    headers?: string[];
    rows?: any[][];
    description?: string;
    [key: string]: any;
  };
  [key: string]: any;
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

// Add a utility to dynamically load exam data
const loadExamData = async (id: string, subject?: string) => {
  try {
    console.log(`Attempting to load exam with ID: ${id}, subject: ${subject}`);
    
    // Cas spécial pour ENSAM
    if (id.startsWith('ensam-')) {
      const [_, year] = id.split('-');
      // Chemin par défaut sans sujet
      let path = `ensam/ensam${year}/epreuve_${year}.json`;
      
      // Si un sujet est spécifié, utilisez le chemin avec le sujet
      if (subject) {
        path = `ensam/ensam${year}/${subject}/epreuve_${year}.json`;
      }
      
      console.log(`Loading ENSAM exam: ${path}`);
      
      try {
        // Essayer d'abord avec le chemin public
        const response = await fetch(`/concours/${path}`);
        if (response.ok) {
          return await response.json();
        }
        throw new Error('File not found in public path');
      } catch (innerError) {
        console.log("Trying alternate paths for ENSAM exam");
        
        // Essayer avec le chemin direct sans 'public'
        try {
          const directResponse = await fetch(`/concours/${path}`);
          if (directResponse.ok) {
            return await directResponse.json();
          }
        } catch (directError) {
          console.log("Direct path failed:", directError);
        }
        
        // Essayer avec import relatif pour le développement
        try {
          const importPath = `../../../concours/${path}`;
          console.log(`Fallback: Importing from path: ${importPath}`);
          const examModule = await import(importPath);
          return examModule.default;
        } catch (importError) {
          console.log("Import path failed:", importError);
          
          // Dernier essai avec chemin sans 'public' et import
          try {
            const alternateImportPath = `../../../${path}`;
            console.log(`Last resort: Importing from direct path: ${alternateImportPath}`);
            const examModule = await import(alternateImportPath);
            return examModule.default;
          } catch (finalError) {
            throw new Error(`Failed to load ENSAM exam from multiple paths: ${finalError}`);
          }
        }
      }
    }
    
    // Cas spécial pour ENSA avec matières spécifiques
    if (id.startsWith('ensa-') && subject) {
      const [_, year] = id.split('-');
      const path = `ensa/ensa${year}/${subject}/epreuve_${year}.json`;
      console.log(`Loading ENSA exam with specific subject: ${path}`);
      
      try {
        // First try with the public path
        const response = await fetch(`/concours/${path}`);
        if (response.ok) {
          return await response.json();
        }
        // Essayer le chemin direct sans 'public'
        const directResponse = await fetch(`/${path}`);
        if (directResponse.ok) {
          return await directResponse.json();
        }
        throw new Error('File not found in public or direct paths');
      } catch (innerError) {
        // Fallback to relative import for development
        try {
          const importPath = `../../../concours/${path}`;
          console.log(`Fallback: Importing from ENSA path: ${importPath}`);
          const examModule = await import(importPath);
          return examModule.default;
        } catch (importError) {
          // Dernier essai avec chemin sans 'public'
          try {
            const alternateImportPath = `../../../${path}`;
            console.log(`Last resort: Importing from direct ENSA path: ${alternateImportPath}`);
            const examModule = await import(alternateImportPath);
            return examModule.default;
          } catch (finalError) {
            throw new Error(`Failed to load ENSA exam from multiple paths: ${finalError}`);
          }
        }
      }
    }
    
    // Extract exam type and year from the ID 
    // This supports various formats like:
    // - medecine2022
    // - medecine-2022
    // - medecine_2022
    const match = id.match(/([a-zA-Z]+)[-_]?(\d{4})/);
    
    // If no match using the pattern above, try to extract from the full path
    // This handles formats like exam-view/medecine-2022
    if (!match && id.includes('/')) {
      const segments = id.split('/');
      const lastSegment = segments[segments.length - 1];
      console.log(`Trying to extract from path segment: ${lastSegment}`);
      const subMatch = lastSegment.match(/([a-zA-Z]+)[-_]?(\d{4})/);
      
      if (subMatch) {
        const [_, examType, year] = subMatch;
        console.log(`Extracted from path: examType=${examType}, year=${year}`);
        
        // Use fetch instead of dynamic import for production compatibility
        try {
          // First try with the public path
          const response = await fetch(`/concours/${examType}/${examType}${year}/epreuve_${year}.json`);
          if (response.ok) {
            return await response.json();
          }
          
          // Try direct path without 'public'
          const directResponse = await fetch(`/${examType}/${examType}${year}/epreuve_${year}.json`);
          if (directResponse.ok) {
            return await directResponse.json();
          }
          
          throw new Error('File not found in public or direct paths');
        } catch (innerError) {
          // Fallback to relative import for development
          try {
            const importPath = `../../../concours/${examType}/${examType}${year}/epreuve_${year}.json`;
            console.log(`Fallback: Importing from path: ${importPath}`);
            const examModule = await import(importPath);
            return examModule.default;
          } catch (importError) {
            console.log("Import path failed:", importError);
            
            // Try direct path import
            try {
              const alternateImportPath = `../../../${examType}/${examType}${year}/epreuve_${year}.json`;
              console.log(`Last resort: Importing from direct path: ${alternateImportPath}`);
              const examModule = await import(alternateImportPath);
              return examModule.default;
            } catch (finalError) {
              throw new Error(`Failed to load exam from multiple paths: ${finalError}`);
            }
          }
        }
      }
    }
    
    if (!match) {
      throw new Error(`Invalid exam ID format: ${id}`);
    }
    
    const [_, examType, year] = match;
    console.log(`Extracted: examType=${examType}, year=${year}`);
    
    // Use fetch instead of dynamic import for production compatibility
    try {
      // First try with the public path
      const response = await fetch(`/concours/${examType}/${examType}${year}/epreuve_${year}.json`);
      if (response.ok) {
        return await response.json();
      }
      
      // Try direct path without 'public'
      const directResponse = await fetch(`/${examType}/${examType}${year}/epreuve_${year}.json`);
      if (directResponse.ok) {
        return await directResponse.json();
      }
      
      throw new Error('File not found in public or direct paths');
    } catch (innerError) {
      // Fallback to relative import for development
      try {
        const importPath = `../../../concours/${examType}/${examType}${year}/epreuve_${year}.json`;
        console.log(`Fallback: Importing from path: ${importPath}`);
        const examModule = await import(importPath);
        return examModule.default;
      } catch (importError) {
        console.log("Import path failed:", importError);
        
        // Try direct path import
        try {
          const alternateImportPath = `../../../${examType}/${examType}${year}/epreuve_${year}.json`;
          console.log(`Last resort: Importing from direct path: ${alternateImportPath}`);
          const examModule = await import(alternateImportPath);
          return examModule.default;
        } catch (finalError) {
          throw new Error(`Failed to load exam from multiple paths: ${finalError}`);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to load exam data for ID: ${id}`, error);
    throw error;
  }
};

// QuickNav component moved outside the main component
interface QuickNavProps {
  examData: ExamData;
  allQuestions: ExamQuestion[];
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  answers: Record<string, string>;
  expandedComponents: Record<string, boolean>;
  setExpandedComponents: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const QuickNav = ({ 
  examData, 
  allQuestions, 
  currentQuestion, 
  setCurrentQuestion, 
  answers,
  expandedComponents,
  setExpandedComponents
}: QuickNavProps) => {
    // Group questions by component
    const questionsByComponent = useMemo(() => {
      const result: Record<string, { component: ExamComponent, questionIndices: number[] }> = {};
      
      let questionIndex = 0;
    examData.components.forEach((component) => {
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
  }, [examData]);
    
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
  }, [expandedComponents, setExpandedComponents]);
    
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

const ExamView = () => {
  const { id, subject } = useParams<{ id: string; subject: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours in seconds
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add states for loading and error handling
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for quick navigation component visibility - moved here to maintain consistent hooks order
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({});
  
  // Load exam data on component mount
  useEffect(() => {
    const fetchExamData = async () => {
      if (!id) {
        setError("No exam ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const rawData = await loadExamData(id, subject);
        console.log(`Loaded exam data for ${id}${subject ? '/' + subject : ''}:`, rawData);
        
        // Normalize the data structure based on what we received
        let normalizedData: any = { components: [] };
        
        // Case spécifique pour les fichiers avec structure "exercises" (format PC)
        if (rawData && typeof rawData === 'object' && 'exercises' in rawData && Array.isArray(rawData.exercises)) {
          console.log("Structure détectée: fichier avec exercises (format physique-chimie)");
          console.log("Exercises trouvés:", rawData.exercises.length);
          
          try {
            // Corriger les chemins d'images si nécessaire
            const correctedExercises = rawData.exercises.map(exercise => {
              // Copier l'exercice
              const correctedExercise = { ...exercise };
              
              // Corriger le chemin de l'image de l'exercice si présent
              if (correctedExercise.programmatic_figure && correctedExercise.programmatic_figure.type === 'image') {
                const imagePath = correctedExercise.programmatic_figure.image_url;
                // Si le chemin commence par /, il est déjà absolu
                if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                  // Extraire l'année de l'ID
                  const yearMatch = id?.match(/\d{4}/);
                  const year = yearMatch ? yearMatch[0] : '';
                  
                  // Construire le chemin absolu
                  correctedExercise.programmatic_figure.image_url = `/concours/ensa/ensa${year}/${subject}/images/${imagePath}`;
                  console.log(`Chemin d'image corrigé: ${imagePath} -> ${correctedExercise.programmatic_figure.image_url}`);
                }
              }
              
              // Corriger les chemins pour plusieurs images dans l'exercice
              if (correctedExercise.programmatic_figures && Array.isArray(correctedExercise.programmatic_figures)) {
                correctedExercise.programmatic_figures = correctedExercise.programmatic_figures.map(figure => {
                  if (figure.type === 'image') {
                    const imagePath = figure.image_url;
                    // Si le chemin commence par /, il est déjà absolu
                    if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                      // Extraire l'année de l'ID
                      const yearMatch = id?.match(/\d{4}/);
                      const year = yearMatch ? yearMatch[0] : '';
                      
                      // Construire le chemin absolu
                      figure.image_url = `/concours/ensa/ensa${year}/${subject}/images/${imagePath}`;
                      console.log(`Chemin d'image multiple corrigé: ${imagePath} -> ${figure.image_url}`);
                    }
                  }
                  return figure;
                });
              }
              
              // Corriger les chemins d'images dans les questions
              if (correctedExercise.questions && Array.isArray(correctedExercise.questions)) {
                correctedExercise.questions = correctedExercise.questions.map(question => {
                  const correctedQuestion = { ...question };
                  
                  // Corriger le chemin de l'image de la question si présent
                  if (correctedQuestion.programmatic_figure && correctedQuestion.programmatic_figure.type === 'image') {
                    const imagePath = correctedQuestion.programmatic_figure.image_url;
                    // Si le chemin commence par /, il est déjà absolu
                    if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                      // Extraire l'année de l'ID
                      const yearMatch = id?.match(/\d{4}/);
                      const year = yearMatch ? yearMatch[0] : '';
                      
                      // Construire le chemin absolu
                      correctedQuestion.programmatic_figure.image_url = `/concours/ensa/ensa${year}/${subject}/images/${imagePath}`;
                      console.log(`Chemin d'image corrigé: ${imagePath} -> ${correctedQuestion.programmatic_figure.image_url}`);
                    }
                  }
                  
                  // Corriger les options d'images
                  if (correctedQuestion.options && Array.isArray(correctedQuestion.options)) {
                    correctedQuestion.options = correctedQuestion.options.map(option => {
                      const correctedOption = { ...option };
                      
                      if (correctedOption.programmatic_figure && correctedOption.programmatic_figure.type === 'image') {
                        const imagePath = correctedOption.programmatic_figure.image_url;
                        // Si le chemin commence par /, il est déjà absolu
                        if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                          // Extraire l'année de l'ID
                          const yearMatch = id?.match(/\d{4}/);
                          const year = yearMatch ? yearMatch[0] : '';
                          
                          // Construire le chemin absolu
                          correctedOption.programmatic_figure.image_url = `/concours/ensa/ensa${year}/${subject}/images/${imagePath}`;
                          console.log(`Chemin d'image corrigé: ${imagePath} -> ${correctedOption.programmatic_figure.image_url}`);
                        }
                      }
                      
                      return correctedOption;
                    });
                  }
                  
                  // Corriger les chemins pour plusieurs images dans la question
                  if (correctedQuestion.programmatic_figures && Array.isArray(correctedQuestion.programmatic_figures)) {
                    correctedQuestion.programmatic_figures = correctedQuestion.programmatic_figures.map(figure => {
                      if (figure.type === 'image') {
                        const imagePath = figure.image_url;
                        // Si le chemin commence par /, il est déjà absolu
                        if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                          // Extraire l'année de l'ID
                          const yearMatch = id?.match(/\d{4}/);
                          const year = yearMatch ? yearMatch[0] : '';
                          
                          // Construire le chemin absolu
                          figure.image_url = `/concours/ensa/ensa${year}/${subject}/images/${imagePath}`;
                          console.log(`Chemin d'image multiple corrigé (question): ${imagePath} -> ${figure.image_url}`);
                        }
                      }
                      return figure;
                    });
                  }
                  
                  return correctedQuestion;
                });
              }
              
              return correctedExercise;
            });
            
            // Transformer les exercises en components
            const components = correctedExercises.map(exercise => {
              // Inclure l'exercice comme contexte de composant
              const exerciseNumber = exercise.exercise_number || "";
              const exerciseTitle = exercise.title || `Exercice ${exerciseNumber}`;
              
              // Préparer les questions avec le stimulus de l'exercice ajouté à chaque question
              const questionsWithContext = (exercise.questions || []).map(question => {
                // Si la question n'a pas de stimulus mais que l'exercice en a un, ajouter le stimulus de l'exercice
                const enhancedQuestion = {
                  ...question,
                  // Si la question n'a pas déjà un stimulus, utiliser celui de l'exercice
                  stimulus: question.stimulus || exercise.stimulus,
                  // Conserver la figure de l'exercice dans la question si elle n'en a pas déjà une
                  programmatic_figure: question.programmatic_figure || exercise.programmatic_figure,
                  // Transférer également les figures multiples si la question n'en a pas
                  programmatic_figures: question.programmatic_figures || exercise.programmatic_figures,
                  // Ajouter le titre de l'exercice comme information supplémentaire
                  exercise_title: exerciseTitle,
                  // Si la question n'a pas de données supplémentaires, héritage de l'exercice
                  data: question.data ?? exercise.data,
                };
                
                return enhancedQuestion;
              });
              
              return {
                component_name: exerciseTitle,
                coefficient: 1,
                questions: questionsWithContext || []
              };
            });
            
            normalizedData = {
              exam_title: rawData.exam_title || `Examen ${id.match(/\d{4}/)?.[0] || ''}`,
              components: components
            };
            
            console.log("Structure normalisée avec succès:", normalizedData);
            console.log("Premier component:", normalizedData.components[0]);
            console.log("Nombre de questions dans le premier component:", normalizedData.components[0].questions.length);
            
            setExamData(normalizedData);
            
            // Initialize expandedComponents
            if (normalizedData.components && normalizedData.components.length > 0) {
              setExpandedComponents({
                [normalizedData.components[0].component_name]: true
              });
            }
            
            setIsLoading(false);
            return; // Return early but after setting loading state to false
          } catch (error) {
            console.error("Erreur lors de la normalisation de la structure exercises:", error);
            // Ne pas throw l'erreur ici pour permettre aux autres méthodes de normalisation d'être essayées
          }
        }
        
        // Case 1: Data is an array (like 2021 format)
        if (Array.isArray(rawData)) {
          console.log("Processing array-format exam data (2021 format)");
          console.log("Raw 2021 data first item structure:", JSON.stringify(rawData[0], null, 2));
          
          // Create a normalized exam data structure
          let extractedComponents: ExamComponent[] = [];
          
          // Check if the second element has the actual exam structure
          if (rawData.length > 1 && rawData[1] && typeof rawData[1] === 'object') {
            console.log("Examining second element in 2021 format array");
            
            // If second element has 'components' property, use it directly
            if (rawData[1].components && Array.isArray(rawData[1].components)) {
              console.log(`Found ${rawData[1].components.length} components in second array element`);
              extractedComponents = rawData[1].components;
              
              // Check if components have questions
              let totalQuestions = 0;
              extractedComponents.forEach((comp, idx) => {
                if (comp.questions && Array.isArray(comp.questions)) {
                  totalQuestions += comp.questions.length;
                  console.log(`Component ${idx} (${comp.component_name}) has ${comp.questions.length} questions`);
                }
              });
              
              console.log(`Total extracted questions from all components: ${totalQuestions}`);
              
              // Use the structure as-is if it has the expected format
              if (totalQuestions > 0) {
                normalizedData = {
                  exam_title: rawData[1].exam_title || `Examen Médecine ${id.match(/\d{4}/)?.[0] || ''}`,
                  components: extractedComponents
                };
                
                console.log("Successfully normalized 2021 format with nested components structure");
                // Don't return early, continue to set loading state to false
                // Just skip the rest of the processing
                console.log("Skipping additional processing");
                
                // Set the state and proceed to normal exit
                console.log("Normalized data structure:", normalizedData);
                setExamData(normalizedData);
                
                // Initialize expandedComponents
                if (normalizedData.components && normalizedData.components.length > 0) {
                  setExpandedComponents({
                    [normalizedData.components[0].component_name]: true
                  });
                }
                
                setIsLoading(false);
                return; // Return early but after setting loading state to false
              }
            }
          }
          
          // If we couldn't extract using the component structure, try each array element
          let extractedQuestions: ExamQuestion[] = [];
          
          // For 2021 format, the questions might be at a different location in the data structure
          // Let's check a few common patterns
          rawData.forEach((component, componentIndex) => {
            console.log(`Component ${componentIndex} keys:`, Object.keys(component));
            
            // If component.questions exists and is an array, use it directly
            if (component.questions && Array.isArray(component.questions)) {
              console.log(`Component ${componentIndex} has ${component.questions.length} questions in 'questions' property`);
              extractedQuestions = [...extractedQuestions, ...component.questions];
            }
            // If there's a data property that contains questions
            else if (component.data && Array.isArray(component.data)) {
              console.log(`Component ${componentIndex} has ${component.data.length} items in 'data' property`);
              
              // Check if data items look like questions
              const possibleQuestions = component.data.filter(item => 
                item && typeof item === 'object' && (item.text || item.options || item.question_number)
              );
              
              if (possibleQuestions.length > 0) {
                console.log(`Found ${possibleQuestions.length} question-like objects in component ${componentIndex}'s data`);
                extractedQuestions = [...extractedQuestions, ...possibleQuestions];
              }
            }
            // If component itself is a question (has text, options, etc)
            else if (component.text && (component.options || component.answer || component.choices)) {
              console.log(`Component ${componentIndex} itself looks like a question`);
              extractedQuestions.push(component as unknown as ExamQuestion);
            }
            // If component has a 'question' property
            else if (component.question && typeof component.question === 'object') {
              console.log(`Component ${componentIndex} has a 'question' property`);
              extractedQuestions.push(component.question as unknown as ExamQuestion);
            }
            // Check for other potential question containers
            else {
              // Look for arrays that might contain questions
              Object.entries(component).forEach(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  console.log(`Component ${componentIndex} has array property '${key}' with ${value.length} items`);
                  
                  // Check if items look like questions
                  const possibleQuestions = value.filter(item => 
                    item && typeof item === 'object' && (item.text || item.options || item.question_number)
                  );
                  
                  if (possibleQuestions.length > 0) {
                    console.log(`Found ${possibleQuestions.length} question-like objects in component ${componentIndex}'s ${key} property`);
                    extractedQuestions = [...extractedQuestions, ...possibleQuestions];
                  }
                }
                
                // Check if value is an object with components property
                if (value && typeof value === 'object' && 'components' in value && Array.isArray((value as any).components)) {
                  console.log(`Component ${componentIndex} has property '${key}' with components array`);
                  extractedComponents = [...extractedComponents, ...(value as any).components];
                }
              });
            }
          });
          
          console.log(`Total extracted questions from direct search: ${extractedQuestions.length}`);
          console.log(`Total extracted components from direct search: ${extractedComponents.length}`);
          
          // If we have components with questions, use them
          if (extractedComponents.length > 0) {
            let totalQuestions = 0;
            extractedComponents.forEach(comp => {
              if (comp.questions) totalQuestions += comp.questions.length;
            });
            
            if (totalQuestions > 0) {
              console.log(`Using ${extractedComponents.length} components with ${totalQuestions} total questions`);
              normalizedData = {
                exam_title: `Examen Médecine ${id.match(/\d{4}/)?.[0] || ''}`,
                components: extractedComponents
              };
            } else {
              console.log("Components found but no questions, using fallback");
              normalizedData = {
                exam_title: `Examen Médecine ${id.match(/\d{4}/)?.[0] || ''}`,
                components: [{
                  component_name: "Examen 2021",
                  coefficient: 1,
                  questions: extractedQuestions.length > 0 ? extractedQuestions : []
                }]
              };
            }
          } else if (extractedQuestions.length > 0) {
            // If we only have questions but no components, create a default component
            console.log(`Creating default component with ${extractedQuestions.length} extracted questions`);
            normalizedData = {
              exam_title: `Examen Médecine ${id.match(/\d{4}/)?.[0] || ''}`,
              components: [{
                component_name: "Examen 2021",
                coefficient: 1,
                questions: extractedQuestions
              }]
            };
          } else {
            // No questions or components found, provide empty structure with warning
            console.warn("No valid questions or components found in the 2021 format data");
            normalizedData = {
              exam_title: `Examen Médecine ${id.match(/\d{4}/)?.[0] || ''}`,
              components: [{
                component_name: "Examen 2021",
                coefficient: 1,
                questions: []
              }]
            };
          }
        } 
        // Case 2: Data is an object with questions at root level
        else if (rawData && typeof rawData === 'object' && rawData.questions) {
          console.log("Processing object with root-level questions");
          normalizedData = {
            exam_title: rawData.exam_title || rawData.title || `Examen ${id.match(/\d{4}/)?.[0] || ''}`,
            components: [{
              component_name: "Main Component",
              coefficient: 1,
              questions: rawData.questions
            }]
          };
        } 
        // Case 3: Data already has components structure (like 2022 format)
        else if (rawData && typeof rawData === 'object' && rawData.components) {
          console.log("Processing standard format with components");
          normalizedData = rawData;
        }
        // Case 4: ENSAM format with specific structure
        else if (rawData && typeof rawData === 'object' && rawData.exam_title && rawData.subject) {
          console.log("Processing ENSAM format");
          
          // Analyse la structure complète pour le debug
          console.log("ENSAM data structure keys:", Object.keys(rawData));
          
          // Check if this looks like the ENSAM format
          if ('exercises' in rawData || 'parties' in rawData || 'sections' in rawData) {
            try {
              // Create normalized structure
              const components: ExamComponent[] = [];
              
              // Process exercises/parties/sections
              const sectionsData = rawData.exercises || rawData.parties || rawData.sections || [];
              if (Array.isArray(sectionsData)) {
                sectionsData.forEach((section, sectionIndex) => {
                  // Extract section title
                  const sectionName = section.title || section.name || `Partie ${sectionIndex + 1}`;
                  
                  // Process questions in this section
                  const questions: ExamQuestion[] = [];
                  if (section.questions && Array.isArray(section.questions)) {
                    section.questions.forEach((question) => {
                      // Ensure the question has all required fields
                      if (!question.options) {
                        question.options = [];
                      }
                      
                      // Add the question to our list
                      questions.push(question);
                    });
                  }
                  
                  // Add this section as a component
                  components.push({
                    component_name: sectionName,
                    coefficient: section.coefficient || 1,
                    questions: questions
                  });
                });
              }
              
              // If there are no sections but there are direct questions
              if (components.length === 0 && rawData.questions && Array.isArray(rawData.questions)) {
                components.push({
                  component_name: "Questions",
                  coefficient: 1,
                  questions: rawData.questions
                });
              }
              
              // If there are still no components, create a fallback
              if (components.length === 0) {
                console.log("Creating fallback component for ENSAM format");
                components.push({
                  component_name: rawData.subject || "Examen ENSAM",
                  coefficient: 1,
                  questions: []
                });
              }
              
              normalizedData = {
                exam_title: rawData.exam_title || rawData.title || `Examen ENSAM ${id.match(/\d{4}/)?.[0] || ''}`,
                components: components
              };
              
              console.log("Normalized ENSAM data:", normalizedData);
            } catch (error) {
              console.error("Error normalizing ENSAM data:", error);
              throw new Error("Failed to normalize ENSAM format");
            }
          } else {
            console.log("Trying generic ENSAM format adaptation");
            
            // Afficher plus de détails sur la structure pour le debug
            if (rawData.content) {
              console.log("Found 'content' field in ENSAM data:", typeof rawData.content);
              if (typeof rawData.content === 'object') {
                console.log("Content structure keys:", Object.keys(rawData.content));
              }
            }
            
            // Sauvegarder le fichier JSON complet dans un fichier pour inspection
            try {
              console.log("Raw ENSAM data structure:", Object.keys(rawData));
              // Afficher les premiers niveaux de la structure
              Object.keys(rawData).forEach(key => {
                const value = rawData[key];
                if (Array.isArray(value)) {
                  console.log(`Key ${key}: Array with ${value.length} items`);
                } else if (typeof value === 'object' && value !== null) {
                  console.log(`Key ${key}: Object with keys ${Object.keys(value)}`);
                } else {
                  console.log(`Key ${key}: ${typeof value}`);
                }
              });
            } catch (err) {
              console.log("Error examining ENSAM data:", err);
            }
            
            // Récupérer les questions depuis différentes sources possibles
            let questions: ExamQuestion[] = [];
            let components: ExamComponent[] = [];
            
            // Si le format contient des parties ou des sections
            if (rawData.parts && Array.isArray(rawData.parts)) {
              console.log("Found 'parts' array in ENSAM data with " + rawData.parts.length + " items");
              
              // Parcourir les parties pour extraire les questions
              rawData.parts.forEach((part, partIndex) => {
                // Extraire le titre de la section
                const sectionName = part.part_title || part.title || `Partie ${partIndex+1}`;
                
                // Mémoriser les instructions pour cette partie
                const partInstructions = part.instructions || "";
                
                // Process questions in this section
                const questions: ExamQuestion[] = [];
                if (part.questions && Array.isArray(part.questions)) {
                  console.log(`Found ${part.questions.length} questions in part ${partIndex+1}`);
                  
                  // Transformer chaque question au format attendu
                  const partQuestions = part.questions.map((q: any, qIndex: number) => {
                    // Vérifier si les options sont déjà au bon format
                    let options = q.options || [];
                    
                    // Si on a des options et qu'elles sont au format attendu (Array)
                    if (Array.isArray(q.choices)) {
                      options = q.choices.map((choice: any, idx: number) => {
                        if (typeof choice === 'string') {
                          return { label: String.fromCharCode(65 + idx), text: choice };
                        }
                        return choice;
                      });
                    }
                    
                    // Si on n'a pas d'options et que c'est une question non-QCM (comme en mathématiques)
                    if (options.length === 0) {
                      // Créer un champ de saisie pour la réponse
                      options = [
                        { 
                          label: "input", 
                          text: "Votre réponse",
                          is_input: true
                        }
                      ];
                    }
                    
                    return {
                      question_number: q.question_number || q.id || `P${partIndex+1}Q${qIndex+1}`,
                      text: q.text_fr || q.text || q.question || q.statement || "",
                      stimulus: partInstructions,  // Ajouter les instructions comme contexte
                      programmatic_figure: q.programmatic_figure,
                      programmatic_figures: q.programmatic_figures,
                      options: options
                    };
                  });
                  
                  questions.push(...partQuestions);
                }
                
                // Add this section as a component
                components.push({
                  component_name: sectionName,
                  coefficient: part.coefficient || 1,
                  questions: questions
                });
              });
            }
            
            // Si nous avons des questions à la racine du document
            if (rawData.questions && Array.isArray(rawData.questions)) {
              console.log(`Found ${rawData.questions.length} questions at root level`);
              // Créer des questions pour les ajouter à un composant
              const rootQuestions = rawData.questions.map((q: any, qIndex: number) => {
                // Vérifier si les options sont déjà au bon format
                let options = q.options || [];
                
                // Si on n'a pas d'options et que c'est une question non-QCM
                if (options.length === 0) {
                  options = [{ label: "input", text: "Votre réponse", is_input: true }];
                }
                
                return {
                  question_number: q.question_number || q.id || `Q${qIndex+1}`,
                  text: q.text_fr || q.text || q.statement || q.question || "",
                  options: options,
                  programmatic_figure: q.programmatic_figure,
                  programmatic_figures: q.programmatic_figures
                };
              });
              
              // Ajouter un composant avec ces questions
              components.push({
                component_name: "Questions principales",
                coefficient: 1,
                questions: rootQuestions
              });
            }
            
            // Explorer tous les champs à la recherche de questions supplémentaires
            if (components.length === 0) {
              console.log("Searching for questions in all fields...");
              Object.entries(rawData).forEach(([key, value]) => {
                // Chercher les tableaux qui pourraient contenir des questions
                if (Array.isArray(value)) {
                  const possibleQuestions = value.filter((item: any) => 
                    item && typeof item === 'object' && (
                      (item.text && (item.options || item.choices)) ||
                      (item.question_number && item.text) ||
                      (item.question && Array.isArray(item.options))
                    )
                  );
                  
                  if (possibleQuestions.length > 0) {
                    console.log(`Found ${possibleQuestions.length} potential questions in field '${key}'`);
                    
                    const formattedQuestions = possibleQuestions.map((q: any, idx: number) => {
                      const question: any = {
                        question_number: q.question_number || q.id || `Q${questions.length + idx + 1}`,
                        text: q.text_fr || q.text || q.question || q.statement || "",
                        options: []
                      };
                      
                      if (q.options && Array.isArray(q.options)) {
                        question.options = q.options;
                      } else if (q.choices && Array.isArray(q.choices)) {
                        question.options = q.choices.map((choice: any, choiceIdx: number) => {
                          if (typeof choice === 'string') {
                            return {
                              label: String.fromCharCode(65 + choiceIdx), // A, B, C...
                              text: choice
                            };
                          }
                          return choice;
                        });
                      } else {
                        // Si c'est une question sans options, ajouter un champ de saisie
                        question.options = [{ label: "input", text: "Votre réponse", is_input: true }];
                      }
                      
                      return question;
                    });
                    
                    // Ajouter ces questions à un nouveau composant
                    components.push({
                      component_name: `Section ${key}`,
                      coefficient: 1,
                      questions: formattedQuestions
                    });
                  }
                }
                
                // Check if value is an object with components property
                if (value && typeof value === 'object' && 'components' in value && Array.isArray((value as any).components)) {
                  console.log(`Component ${key} has property 'components' with components array`);
                  components = [...components, ...(value as any).components];
                }
              });
            }
            
            // Si nous n'avons toujours pas de composants, créer un exemple
            if (components.length === 0) {
              console.log("No questions found in ENSAM data, creating example questions");
              questions = [
                {
                  question_number: "1",
                  text: "Quelle est la deuxième loi de Newton?",
                  options: [
                    { label: "A", text: "F = ma" },
                    { label: "B", text: "E = mc²" },
                    { label: "C", text: "F = -kx" },
                    { label: "D", text: "P = F·v" }
                  ]
                },
                {
                  question_number: "2",
                  text: "Quelle est l'unité du courant électrique?",
                  options: [
                    { label: "A", text: "Volt" },
                    { label: "B", text: "Ampère" },
                    { label: "C", text: "Ohm" },
                    { label: "D", text: "Watt" }
                  ]
                }
              ];
              
              components.push({
                component_name: rawData.subject || "Examen principal",
                coefficient: 1,
                questions: questions
              });
            }
            
            // Generic fallback for ENSAM format
            normalizedData = {
              exam_title: rawData.exam_title || `Examen ENSAM ${id.match(/\d{4}/)?.[0] || ''}`,
              components: components
            };
            
            console.log(`ENSAM adaptor created ${components.length} components with ${components.reduce((sum, comp) => sum + comp.questions.length, 0)} questions total`);
          }
        }
        // Case 5: Unknown structure
        else {
          throw new Error("Unknown exam data structure - cannot process");
        }
        
        console.log("Normalized data structure:", normalizedData);
        setExamData(normalizedData);
        
        // Initialize expandedComponents after data is loaded
        if (normalizedData && normalizedData.components && normalizedData.components.length > 0) {
          setExpandedComponents({
            [normalizedData.components[0].component_name]: true
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to load exam:`, error);
        setError(`Failed to load exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };
    
    fetchExamData();
  }, [id, subject]);
  
  // Flatten all questions from all components
  const allQuestions = useMemo(() => {
    if (!examData) {
      console.log("No exam data available yet");
      return [];
    }
    
    // Add better structure validation
    if (!examData.components) {
      console.error("Exam data is missing 'components' property:", examData);
      return [];
    }
    
    // Check if components is an array
    if (!Array.isArray(examData.components)) {
      console.error("Exam data 'components' is not an array:", examData.components);
      return [];
    }

    console.log(`Processing ${examData.components.length} components`);
    
    // Add a type cast to ExamQuestion[] to avoid TypeScript errors
    return examData.components.flatMap((component, componentIndex) => {
      // Check if component has questions property
      if (!component) {
        console.warn(`Component at index ${componentIndex} is null or undefined`);
        return [];
      }
      
      if (!component.questions) {
        console.warn(`Component at index ${componentIndex} is missing 'questions' array:`, component);
        return [];
      }
      
      if (!Array.isArray(component.questions)) {
        console.warn(`Component at index ${componentIndex} has 'questions' but it's not an array:`, component.questions);
        return [];
      }
      
      console.log(`Component ${componentIndex} (${component.component_name || 'unnamed'}) has ${component.questions.length} questions`);
      return component.questions;
    }) as ExamQuestion[];
  }, [examData]);
  
  // Process exam data
  const examInfo = useMemo(() => {
    if (!examData || !id) {
      return {
        id: id || '',
        title: 'Loading...',
        year: 0,
        duration: '3 heures',
        totalQuestions: 0,
      };
    }
    
    // Extract year from ID
    const yearMatch = id.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : 0;
    
    // Get title, using appropriate property based on data structure
    const title = examData.exam_title || examData.title || `Examen ${year}`;
    
    return {
      id,
      title,
      year,
      duration: '3 heures', // Hardcoded since it's not in the JSON
      totalQuestions: allQuestions.length,
    };
  }, [id, examData, allQuestions.length]);

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
    
    // Save answers to localStorage for the correction page to use
    const answersKey = `answers_${id}${subject ? `_${subject}` : ''}`;
    localStorage.setItem(answersKey, JSON.stringify({
      answers,
      timestamp: new Date().toISOString(),
      examId: id,
      subject: subject || null
    }));
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting answers:", answers);
      toast.success("Concours terminé! Vos réponses ont été soumises avec succès.");
      navigate(`/correction/${id}${subject ? `/${subject}` : ''}`);
    }, 1500);
  };

  // Calculate progress percentage
  const progressPercentage = (currentQuestion + 1) / examInfo.totalQuestions * 100;

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              </div>
              <h2 className="text-xl font-medium mb-2">Chargement de l'examen...</h2>
              <p className="text-muted-foreground text-center">Préparation des questions et des ressources</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Display error state
  if (error || !examData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <Card className="w-full max-w-md border-red-200">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-medium mb-2">Impossible de charger l'examen</h2>
              <p className="text-muted-foreground text-center mb-4">{error || "Une erreur s'est produite lors du chargement de l'examen."}</p>
              <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Current question data with fallback
  const question = allQuestions[currentQuestion] || { 
    question_number: "N/A", 
    text: "Question non disponible", 
    options: [] 
  };
  const isLastQuestion = currentQuestion === allQuestions.length - 1;
  const hasAnswer = !!answers[question?.question_number];

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
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-base font-medium text-primary">{question.question_number}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-foreground">
                    {examInfo.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>Année: {examInfo.year}</span>
                    <span>•</span>
                    <span>Durée: {examInfo.duration}</span>
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
                    Question {currentQuestion + 1}/{examInfo.totalQuestions}
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
            {examData && <QuickNav 
              examData={examData} 
              allQuestions={allQuestions} 
              currentQuestion={currentQuestion} 
              setCurrentQuestion={setCurrentQuestion} 
              answers={answers}
              expandedComponents={expandedComponents}
              setExpandedComponents={setExpandedComponents}
            />}

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
                              
                              {/* Cas où data est une simple chaîne ou un tableau de chaînes */}
                              {typeof question.data === 'string' && (
                                <p className="text-sm"><MathRenderer text={question.data} /></p>
                              )}
                              {Array.isArray(question.data) && question.data.every(item => typeof item === 'string') && (
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  {question.data.map((val: string, idx: number) => (
                                    <li key={idx}><MathRenderer text={val} /></li>
                                  ))}
                                </ul>
                              )}
                              
                              {/* Table data */}
                              {typeof question.data === 'object' && 'type' in question.data && question.data.type === 'table' && (
                                <div className="overflow-x-auto w-full max-w-full my-4 -mx-4 sm:mx-0">
                                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                    <table className="text-sm shadow-md w-full md:w-auto" style={{borderCollapse: 'collapse', borderWidth: '1px', borderStyle: 'solid', borderColor: '#d1d5db', minWidth: '100%', tableLayout: 'auto'}}>
                                      <colgroup>
                                        <col style={{width: 'auto', minWidth: '120px'}} />
                                        <col style={{width: 'auto'}} />
                                        <col style={{width: 'auto', minWidth: '100px'}} />
                                      </colgroup>
                                      {/* Display columns as headers if they exist */}
                                      {question.data.type === 'table' && question.data.columns && (
                                        <thead>
                                          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
                                            {question.data.columns.map((column, idx) => (
                                              <th 
                                                key={idx} 
                                                style={{ 
                                                  borderWidth: '1px', 
                                                  borderStyle: 'solid',
                                                  borderColor: '#d1d5db',
                                                  padding: '8px 4px',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                }}
                                                className="whitespace-normal"
                                              >
                                                <div className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm md:text-base" style={{fontSize: '85%'}}>
                                                  <MathRenderer text={column} />
                                                </div>
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                      )}
                                      
                                      {/* Use regular headers if columns don't exist */}
                                      {question.data.type === 'table' && !question.data.columns && question.data.headers && (
                                        <thead>
                                          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
                                            {question.data.headers.map((header, idx) => (
                                              <th 
                                                key={idx} 
                                                style={{ 
                                                  borderWidth: '1px', 
                                                  borderStyle: 'solid',
                                                  borderColor: '#d1d5db',
                                                  padding: '8px 4px',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                }}
                                                className="whitespace-normal"
                                              >
                                                <div className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm md:text-base" style={{fontSize: '85%'}}>
                                                  <MathRenderer text={header} />
                                                </div>
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                      )}
                                      <tbody>
                                        {question.data.type === 'table' && question.data.rows && question.data.rows.map((row, rowIdx) => (
                                          <tr key={rowIdx}>
                                            {row.map((cell, cellIdx) => {
                                              // Adjust styling based on column index
                                              let textAlign: 'left' | 'center' | 'right' = 'center';
                                              if (cellIdx === 0) textAlign = 'center'; // Experiment number
                                              else if (cellIdx === 1) textAlign = 'center'; // Wavelength
                                              else if (cellIdx === 2) textAlign = 'center'; // Slit width
                                              
                                              // Force strings for MathRenderer
                                              const cellContent = String(cell);
                                              
                                              // Apply special styling for certain content
                                              let specialStyle = {};
                                              
                                              // Handle plus signs (e.g., +++++) in tables
                                              const isPlusSignOnly = /^(\+)+$/.test(cellContent);
                                              const hasMultiplePlus = cellContent.includes('++++');
                                              
                                              if (isPlusSignOnly || hasMultiplePlus) {
                                                specialStyle = {
                                                  fontWeight: 'bold',
                                                  color: '#2563eb' // blue-600
                                                };
                                              }
                                              
                                              // Apply special styling for text values like "Important", "Faible", etc.
                                              if (['important', 'moyenne', 'faible', 'grand', 'petit', 'moyen'].includes(cellContent.toLowerCase())) {
                                                specialStyle = {
                                                  fontStyle: 'italic',
                                                  color: '#4b5563' // gray-600
                                                };
                                              }
                                              
                                              return (
                                                <td 
                                                  key={cellIdx} 
                                                  style={{ 
                                                    borderWidth: '1px', 
                                                    borderStyle: 'solid',
                                                    borderColor: '#d1d5db',
                                                    padding: '8px 4px',
                                                    textAlign,
                                                    verticalAlign: 'middle',
                                                    height: 'auto',
                                                    minHeight: '50px',
                                                    overflowWrap: 'break-word',
                                                    ...specialStyle
                                                  }}
                                                  className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900/30' : 'bg-gray-50 dark:bg-gray-800/20'}
                                                >
                                                  <div className="font-medium text-xs sm:text-sm md:text-base" style={{width: '100%', fontSize: cellIdx === 1 ? '80%' : '85%'}}>
                                                    <MathRenderer text={cellContent} />
                                                  </div>
                                                </td>
                                              );
                                            })}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  {question.data.type === 'table' && question.data.description && (
                                    <div className="mt-2 text-sm text-foreground">
                                      <span className="font-medium">Description:</span> <MathRenderer text={question.data.description} />
                                    </div>
                                  )}
                                  
                                  {/* Display additional_data when available */}
                                  {'additional_data_for_Q23' in question.data && (
                                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-md">
                                      <h4 className="text-base font-medium mb-2 text-amber-700 dark:text-amber-400">Données supplémentaires:</h4>
                                      <div className="text-sm">
                                        <MathRenderer text={String(question.data.additional_data_for_Q23)} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Results data */}
                              {typeof question.data === 'object' && 'type' in question.data && question.data.type === 'results' && (
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

                              {/* Afficher pK_a1 et pK_a2 s'ils existent */}
                              {(question.data.pK_a1 || question.data.pK_a2) && (
                                <div className="mt-3 mb-3">
                                  <h4 className="text-sm font-medium mb-2">Constantes d'acidité:</h4>
                                  <Card className="bg-white dark:bg-gray-800 border border-border/50">
                                    <CardContent className="p-4">
                                      {question.data.pK_a1 && (
                                        <div className="mb-2 py-1 px-3 rounded-md bg-blue-50/50 dark:bg-blue-900/10">
                                          <MathRenderer text={question.data.pK_a1} />
                                        </div>
                                      )}
                                      {question.data.pK_a2 && (
                                        <div className="py-1 px-3 rounded-md bg-blue-50/50 dark:bg-blue-900/10">
                                          <MathRenderer text={question.data.pK_a2} />
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              )}

                              {/* Autres données spécifiques */}
                              {typeof question.data === 'object' && !Array.isArray(question.data) && question.data !== null && Object.entries(question.data).map(([key, value]) => {
                                // Liste des clés déjà traitées ailleurs
                                const alreadyHandledKeys = [
                                  'type', 'given_values', 'remark', 'note', 'description',
                                  'conductivites_molaires_ioniques', 'calculs_fournis', 
                                  'columns', 'headers', 'rows', 'observations',
                                  'additional_data_for_Q23', 'pK_a1', 'pK_a2'
                                ];
                                
                                // Ignorer les clés déjà traitées
                                if (alreadyHandledKeys.includes(key)) return null;
                                
                                // Afficher les autres données
                                return (
                                  <div key={key} className="mt-3 mb-3">
                                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-md border border-indigo-100 dark:border-indigo-800/30">
                                      <h4 className="text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-400">{key}:</h4>
                                      <div className="text-sm p-2 bg-white dark:bg-gray-800 rounded border border-indigo-100/50 dark:border-indigo-800/20">
                                        <MathRenderer text={typeof value === 'string' ? value : JSON.stringify(value)} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              
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
                                      Note: <MathRenderer text={question.data.remark} />
                                    </div>
                                  )}
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
                                  <MathRenderer text={question.image_description} />
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
                          
                          {/* Handle both singular and plural cases */}
                          {(question.programmatic_figure || question.programmatic_figures) && (
                            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-border/50">
                              {/* Handle single figure */}
                              {question.programmatic_figure && (
                                <>
                                  {question.programmatic_figure.type === 'plot' && (
                                    <PlotRenderer figureData={question.programmatic_figure as any} />
                                  )}
                                  {question.programmatic_figure.type === 'diagram' && (
                                    <DiagramRenderer figureData={question.programmatic_figure as any} />
                                  )}
                                  {question.programmatic_figure.type === 'raw_svg' && (
                                    <RawSvgRenderer figureData={question.programmatic_figure as any} />
                                  )}
                                  {question.programmatic_figure.type === 'svg_file' && (
                                    <SvgFileRenderer figureData={question.programmatic_figure as any} />
                                  )}
                                  {question.programmatic_figure.type === 'image' && (
                                    <ImageRenderer figureData={question.programmatic_figure as any} />
                                  )}
                                </>
                              )}
                              {/* Handle multiple figures */}
                              {question.programmatic_figures && (
                                <div className="flex flex-wrap gap-4">
                                  {question.programmatic_figures.map((figure, index) => {
                                    // Handle all supported figure types, including images
                                    if (figure.type === 'plot') {
                                      return (
                                        <div key={index} className="flex-1 min-w-[300px]">
                                          <PlotRenderer figureData={figure as any} />
                                        </div>
                                      );
                                    } else if (figure.type === 'diagram') {
                                      return (
                                        <div key={index} className="flex-1 min-w-[300px]">
                                          <DiagramRenderer figureData={figure as any} />
                                        </div>
                                      );
                                    } else if (figure.type === 'image') {
                                      return (
                                        <div key={index} className="flex-1 min-w-[250px] flex flex-col items-center">
                                          <div className="mb-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                                            {figure.title}
                                          </div>
                                          <img 
                                            src={figure.image_url} 
                                            alt={figure.description || figure.title || "Image"}
                                            style={{ 
                                              maxWidth: figure.width || '100%',
                                              maxHeight: figure.height || '400px',
                                              objectFit: 'contain'
                                            }}
                                            className="rounded-md border border-gray-200 dark:border-gray-700"
                                          />
                                          {figure.description && (
                                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                                              {figure.description}
                                            </div>
                                  )}
                                </div>
                                      );
                                    } else if (figure.type === 'raw_svg') {
                                      return (
                                        <div key={index} className="flex-1 min-w-[300px]">
                                          <RawSvgRenderer figureData={figure as any} />
                                        </div>
                                      );
                                    } else if (figure.type === 'svg_file') {
                                      return (
                                        <div key={index} className="flex-1 min-w-[300px]">
                                          <SvgFileRenderer figureData={figure as any} />
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              )}
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
                      {Array.isArray(question.options) ? question.options.map((option, index) => (
                        option.is_input ? (
                          <motion.div
                            key={`input-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex flex-col space-y-2 border border-border/60 rounded-lg p-4 transition-all hover:border-primary/60 bg-background/80">
                              <label className="font-medium text-base" htmlFor={`response-${question.question_number}`}>
                                Votre réponse:
                              </label>
                              <Textarea
                                id={`response-${question.question_number}`}
                                value={answers[question.question_number] || ""}
                                onChange={(e) => handleAnswer(question.question_number, e.target.value)}
                                placeholder="Entrez votre réponse ici..."
                                className="resize-none min-h-[100px] border-primary/30 focus:border-primary"
                              />
                            </div>
                          </motion.div>
                        ) : (
                        <motion.div
                          key={option.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
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
                                {option.programmatic_figure && option.programmatic_figure.type === 'image' && (
                                  <div className="mt-2">
                                    <img 
                                      src={option.programmatic_figure.image_url}
                                      alt={option.programmatic_figure.alt_text || "Figure"}
                                      style={{ 
                                        maxHeight: '80px',
                                        display: 'inline-block',
                                        marginTop: '4px'
                                      }}
                                      className="border-0"
                                    />
                                  </div>
                                )}
                            </Label>
                          </div>
                        </motion.div>
                        )
                      )) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <p className="text-amber-800 dark:text-amber-300">
                              Aucune option disponible pour cette question.
                            </p>
                          </div>
                        </div>
                      )}
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