import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
// Import KaTeX pour le rendu des formules mathématiques
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Styles pour animations des barres de progression
const ProgressBarStyles = () => {
  return (
    <style>
      {`
        @keyframes growWidth {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .progress-bar {
          animation: growWidth 1.5s ease-out forwards;
        }
      `}
    </style>
  );
};
// Import Recharts pour les graphiques
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Award, ChevronRight, Download, FileText, CheckCircle, XCircle, AlertCircle, Trophy, 
  Brain, Target, Book, BookOpen, Sparkles, ArrowRight, LightbulbIcon, BookmarkIcon, 
  Dices, BarChart2, AlertTriangle, ArrowLeft, Check, FileCheck, Flame, HelpCircle, 
  Lightbulb, MessageCircle, X 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// MathRenderer component for handling LaTeX expressions in text
const MathRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  
  try {
    // Gestion des expressions LaTeX avec $ simple et double $$
    // 1. Trouver d'abord les expressions de type $$...$$ (block math)
    // 2. Puis trouver les expressions de type $...$ (inline math)
    
    // Étape 1: Séparer le texte en fragments normaux et blocks LaTeX ($$...$$)
    const blockRegex = /\$\$(.*?)\$\$/gs; // Le 's' permet de capturer sur plusieurs lignes
    let fragments = [];
    let lastBlockIndex = 0;
    let blockMatch;
    
    const textCopy = text.toString();
    
    while ((blockMatch = blockRegex.exec(textCopy)) !== null) {
      // Ajouter le texte avant le bloc
      if (blockMatch.index > lastBlockIndex) {
        fragments.push({ type: 'mixte', content: textCopy.substring(lastBlockIndex, blockMatch.index) });
      }
      
      // Ajouter le bloc LaTeX
      fragments.push({ type: 'block', content: blockMatch[1] });
      
      lastBlockIndex = blockMatch.index + blockMatch[0].length;
    }
    
    // Ajouter le texte restant après le dernier bloc
    if (lastBlockIndex < textCopy.length) {
      fragments.push({ type: 'mixte', content: textCopy.substring(lastBlockIndex) });
    }
    
    // Étape 2: Pour chaque fragment de type 'mixte', chercher les expressions inline ($...$)
    const processedFragments = [];
    const inlineRegex = /\$(.*?)\$/g;
    
    fragments.forEach((fragment, fragIndex) => {
      if (fragment.type === 'block') {
        processedFragments.push(fragment);
      } else {
        // Pour le texte mixte, chercher les expressions inline
        const inlineContent = fragment.content;
        let parts = [];
        let lastInlineIndex = 0;
        let inlineMatch;
        
        while ((inlineMatch = inlineRegex.exec(inlineContent)) !== null) {
          // Texte avant l'expression inline
          if (inlineMatch.index > lastInlineIndex) {
            parts.push({ type: 'text', content: inlineContent.substring(lastInlineIndex, inlineMatch.index) });
          }
          
          // Expression inline
          parts.push({ type: 'inline', content: inlineMatch[1] });
          
          lastInlineIndex = inlineMatch.index + inlineMatch[0].length;
        }
        
        // Texte restant
        if (lastInlineIndex < inlineContent.length) {
          parts.push({ type: 'text', content: inlineContent.substring(lastInlineIndex) });
        }
        
        // Ajouter tous les fragments traités
        processedFragments.push(...parts);
      }
    });
    
    // Rendu de tous les fragments
    return (
      <span>
        {processedFragments.map((part, index) => {
          if (part.type === 'inline') {
            try {
              return <InlineMath key={`inline-${index}`} math={part.content} />;
            } catch (error) {
              console.error('Error rendering inline LaTeX:', error, part.content);
              return <span key={`inline-error-${index}`} className="text-red-500">${part.content}$</span>;
            }
          } else if (part.type === 'block') {
            try {
              return <BlockMath key={`block-${index}`} math={part.content} />;
            } catch (error) {
              console.error('Error rendering block LaTeX:', error, part.content);
              return <div key={`block-error-${index}`} className="text-red-500 my-2 p-2 border border-red-300 rounded">$${part.content}$$</div>;
            }
          } else {
            return <span key={`text-${index}`}>{part.content}</span>;
          }
        })}
      </span>
    );
  } catch (error) {
    console.error('Error in MathRenderer:', error, text);
    // Fallback en cas d'erreur globale
    return <span className="text-orange-500 font-mono text-sm">{text}</span>;
  }
};

// CircularProgress component for score visualization
const CircularProgress = ({ value, max }: { value: number; max: number }) => {
  const percentage = Math.round((value / max) * 100);
  const strokeDasharray = 283; // 2 * PI * 45 (radius)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  const scoreColor = percentage >= 70 ? "#22c55e" : percentage >= 50 ? "#eab308" : "#ef4444";
  
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-muted/30 fill-none"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
        />
        <circle
          className="fill-none transition-all duration-500 ease-in-out"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          stroke={scoreColor}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}</span>
        <span className="text-xs text-muted-foreground">%</span>
      </div>
    </div>
  );
};

// Composant pour le graphique en camembert des réponses
const AnswersPieChart = ({ correctAnswers, wrongAnswers, notAnswered }: { correctAnswers: number; wrongAnswers: number; notAnswered: number }) => {
  // Définition des couleurs vives et distinctes - ordre explicite pour éviter les confusions
  const COLORS = {
    correct: '#22c55e',  // vert - correctes
    incorrect: '#ef4444', // rouge - incorrectes
    notAnswered: '#f59e0b'  // orange - non répondues
  };
  
  // Assurons-nous que les données sont clairement identifiées
  const data = [
    { name: 'Correctes', value: correctAnswers, id: 'correct', color: COLORS.correct, description: 'Réponses justes' },
    { name: 'Incorrectes', value: wrongAnswers, id: 'incorrect', color: COLORS.incorrect, description: 'Réponses erronées' },
    { name: 'Non répondues', value: notAnswered, id: 'notAnswered', color: COLORS.notAnswered, description: 'Questions sans réponse' }
  ];
  
  // Filtrer les données pour ne garder que celles avec des valeurs > 0
  const filteredData = data.filter(item => item.value > 0);
  
  const RADIAN = Math.PI / 180;
  
  // Custom label render pour un design plus moderne
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Récupérer la couleur correcte à partir des données filtrées
    const item = filteredData[index];
    if (!item || item.value === 0) return null;

    return (
      <text x={x} y={y} fill={item.color} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip plus détaillé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="font-medium" style={{ color: payload[0].payload.color }}>{payload[0].payload.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{payload[0].value} questions</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{payload[0].payload.description}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend plus moderne
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center gap-6 mt-4">
        {payload.map((entry, index) => {
          // Trouver l'item correspondant dans nos données
          const item = filteredData.find(d => d.id === entry.payload.id) || entry.payload;
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium">{item.name}</span>
            </li>
          );
        })}
      </ul>
    );
  };
  
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {/* Générer les gradients pour chaque couleur */}
            {Object.entries(COLORS).map(([key, color]) => (
              <linearGradient key={`gradient-${key}`} id={`colorGradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={color} stopOpacity={1}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {filteredData.map((entry) => (
              <Cell 
                key={`cell-${entry.id}`} 
                fill={`url(#colorGradient-${entry.id})`} 
                stroke="none" 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
          <Legend content={<CustomLegend payload={undefined} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant pour la visualisation des forces et faiblesses par thème (bar chart vertical au lieu de radar)
const StrengthsWeaknessesRadarChart = ({ topicScores }: { topicScores: { topic: string; score: number; maxScore: number }[] }) => {
  // Transformer les données pour un affichage plus moderne avec barres verticales
  const data = topicScores.map(item => {
    const percentage = Math.round((item.score / item.maxScore) * 100);
    return {
      topic: item.topic,
      score: item.score,
      maxScore: item.maxScore,
      percentage,
      // Niveau de compétence (couleur dynamique)
      strengthLevel: percentage >= 70 ? 'Expert' : percentage >= 50 ? 'Intermédiaire' : 'Débutant',
      // Couleur selon le niveau
      color: percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'
    };
  });
  
  // Trier par pourcentage (forces en premier)
  data.sort((a, b) => b.percentage - a.percentage);
  
  return (
    <div className="w-full h-80 pt-2">
      <ProgressBarStyles />
      {/* Visualisation en barres horizontales avec indicateurs de niveau */}
      <div className="grid grid-cols-1 gap-3">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex items-center mb-1">
              <div className="flex-grow">
                <span className="font-medium text-sm truncate block" title={item.topic}>
                  {item.topic}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: item.color }}>
                  {item.percentage}%
                </span>
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap" 
                  style={{ 
                    backgroundColor: `${item.color}15`, 
                    color: item.color,
                    border: `1px solid ${item.color}30`
                  }}
                >
                  {item.strengthLevel}
                </span>
              </div>
            </div>
            
            {/* Barre de progression avec animation */}
            <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              {/* Fond de barre gradué */}
              <div className="absolute inset-0 flex w-full">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-full flex-1 border-r border-gray-200 dark:border-gray-700 last:border-0"
                    style={{ opacity: i % 2 === 0 ? 0.4 : 0.2 }}
                  />
                ))}              
              </div>
              
              {/* Barre de progression avec dégradé */}
              <div 
                className="absolute h-full rounded-md transition-all duration-1000 ease-out flex items-center progress-bar" 
                style={{ 
                  width: `${item.percentage}%`,
                  background: `linear-gradient(90deg, ${item.color}50, ${item.color})`,
                  boxShadow: `0 0 10px ${item.color}50`
                }}
              >
                {/* Points spécifiques */}
                <div className="absolute right-1 text-xs font-bold text-white flex items-center justify-center h-6 min-w-6 px-1 rounded">
                  {item.score}/{item.maxScore}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour le graphique en barres des scores par thème
const TopicBarChart = ({ topicScores }: { topicScores: { topic: string; score: number; maxScore: number }[] }) => {
  // Transformer les données pour le graphique en barres
  // Limiter à 5 matières pour une meilleure lisibilité si nécessaire
  const limitedData = topicScores.slice(0, 5);
  
  const data = limitedData.map(item => ({
    topic: item.topic,
    score: item.score,
    maxScore: item.maxScore,
    percentage: Math.round((item.score / item.maxScore) * 100)
  }));
  
  // Custom tooltip pour un design plus moderne
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { topic, score, maxScore, percentage } = payload[0].payload;
      const color = percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="font-medium mb-1">{topic}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-gray-600 dark:text-gray-300 text-sm">Points obtenus:</span>
            <span className="text-sm font-bold text-right">{score}</span>
            
            <span className="text-gray-600 dark:text-gray-300 text-sm">Points maximum:</span>
            <span className="text-sm font-medium text-right text-gray-600 dark:text-gray-300">{maxScore}</span>
            
            <span className="text-gray-600 dark:text-gray-300 text-sm">Pourcentage:</span>
            <span className="text-sm font-bold text-right" style={{ color }}>{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom XAxis Tick pour éviter la superposition des textes longs
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#334155"
          fontSize="12"
          fontWeight="500"
          transform="rotate(-25)"
        >
          {/* Formater les noms de matières pour qu'ils soient plus lisibles */}
          {payload.value.length > 15 ? `${payload.value.substring(0, 15)}...` : payload.value}
        </text>
      </g>
    );
  };

  // Custom Legend avec style moderne
  const CustomLegend = ({ payload }) => {
    // Définition des descriptions explicites pour les éléments de légende
    const legendLabels = [
      { key: 'score', label: 'Points obtenus' },
      { key: 'maxScore', label: 'Points possibles' }
    ];

    return (
      <div className="flex justify-center items-center gap-6 mt-4">
        {payload.map((entry, index) => {
          // Trouver le label correspondant à cette entrée
          const legendItem = legendLabels.find(item => item.key === entry.dataKey) || { label: entry.value };
          
          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-sm" 
                style={{ 
                  background: index === 0 ? 
                    'linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)' : 
                    'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 100%)' 
                }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{legendItem.label}</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
          barGap={4}
          barSize={20}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9}/>
            </linearGradient>
            <linearGradient id="maxScoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" stopOpacity={0.7}/>
              <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.6}/>
            </linearGradient>
            <filter id="barShadow" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.1"/>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="topic" 
            tick={<CustomXAxisTick x={undefined} y={undefined} payload={undefined} />} 
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis 
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }} />
          <Legend content={<CustomLegend payload={undefined} />} />
          <Bar 
            dataKey="score" 
            name="Points obtenus" 
            fill="url(#scoreGradient)" 
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={1500}
            filter="url(#barShadow)"
          />
          <Bar 
            dataKey="maxScore" 
            name="Points possibles" 
            fill="url(#maxScoreGradient)" 
            radius={[4, 4, 0, 0]}
            animationBegin={300}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Types for correction data
interface CorrectionQuestion {
  question_number: string;
  text: string;
  options: Array<{ label: string; text: string }>;
  correct_option: string;
  explanation: string;
  programmatic_figure?: any;
  programmatic_figures?: any[];
}

interface CorrectionComponent {
  component_name: string;
  coefficient: number;
  questions: CorrectionQuestion[];
}

interface CorrectionData {
  exam_title: string;
  date: string;
  duration: string;
  components: CorrectionComponent[];
}

// Types for user answers
interface UserAnswers {
  answers: Record<string, string>;
  timestamp: string;
  examId: string;
  subject: string | null;
}

// Fallback mock correction data in case of loading errors
const mockCorrection = {
  id: "1",
  score: 68,
  maxScore: 100,
  totalQuestions: 5,
  correctAnswers: 3,
  partialAnswers: 1,
  wrongAnswers: 1,
  strengths: ["Algèbre", "Calcul intégral"],
  weaknesses: ["Analyse", "Équations différentielles"],
  feedback: "Vous avez une bonne compréhension des concepts d'algèbre et de calcul intégral. Vous devriez travailler davantage sur les équations différentielles et l'analyse pour améliorer votre score global.",
  recommendations: [
    "Revoir les chapitres sur les équations différentielles",
    "Faire plus d'exercices sur les suites et séries",
    "Pratiquer les démonstrations en analyse",
  ],
  questions: [
    {
      id: "q1",
      text: "Quelle est la limite de f(x) = (1+x)^(1/x) quand x tend vers 0 ?",
      userAnswer: "e",
      correctAnswer: "e",
      isCorrect: true,
      explanation: "La limite de f(x) = (1+x)^(1/x) quand x tend vers 0 est e. On peut le démontrer en posant t = 1/x et en calculant la limite quand t tend vers l'infini de (1+1/t)^t, qui est la définition du nombre e."
    },
    {
      id: "q2",
      text: "Démontrez que la suite définie par u_n+1 = (u_n + a/u_n)/2 avec u_1 > 0 et a > 0 converge vers √a.",
      userAnswer: "J'ai utilisé le fait que la suite est décroissante et minorée par √a...",
      correctAnswer: "La suite est décroissante à partir d'un certain rang et minorée par √a. Elle converge donc vers une limite l ≥ √a. De l'équation u_n+1 = (u_n + a/u_n)/2, on déduit que l = (l + a/l)/2, ce qui implique l = √a.",
      isCorrect: false,
      score: 8,
      maxScore: 20,
      feedback: "Votre approche est correcte, mais la démonstration manque de rigueur et de détails. Il faudrait prouver plus formellement que la suite est décroissante pour u_n > √a et croissante pour u_n < √a."
    },
    {
      id: "q3",
      text: "Dans un espace vectoriel normé, toute suite de Cauchy est :",
      userAnswer: "Convergente si l'espace est complet",
      correctAnswer: "Convergente si l'espace est complet",
      isCorrect: true,
      explanation: "Par définition, un espace est dit complet si toute suite de Cauchy y est convergente."
    },
    {
      id: "q4",
      text: "Calculez l'intégrale suivante : $\\int_{0}^{\\pi} \\sin(x) \\, dx$",
      userAnswer: "-cos(x) entre 0 et pi = -cos(pi) - (-cos(0)) = -(-1) - (-1) = 1 - (-1) = 2",
      correctAnswer: "$-[\\cos(x)]_{0}^{\\pi} = -\\cos(\\pi) - (-\\cos(0)) = -(-1) - (-1) = 1 + 1 = 2$",
      isCorrect: true,
      explanation: "La primitive de sin(x) est -cos(x) + C. On applique le théorème fondamental du calcul."
    },
    {
      id: "q5",
      text: "Quelle est la solution de l'équation différentielle y' + y = 0 ?",
      userAnswer: "y = Ce^x",
      correctAnswer: "y = Ce^(-x)",
      isCorrect: false,
      score: 0,
      maxScore: 10,
      explanation: "On réécrit l'équation sous la forme y' = -y, puis on utilise la méthode de séparation des variables ou on reconnaît directement que y = Ce^(-x) est solution car sa dérivée est -Ce^(-x), ce qui donne bien y' + y = 0."
    }
  ]
};

// Statistiques additionnelles
const additionalStats = [
  { label: "Temps moyen par question", value: "7 min" },
  { label: "Position / classe", value: "12/35" },
  { label: "Amélioration vs précédent", value: "+15%" }
];

// Function to load correction data from JSON file
const loadCorrectionData = async (examId: string, subject?: string): Promise<CorrectionData> => {
  if (!examId) {
    throw new Error("No exam ID provided");
  }
  
  // Case for medical exams
  if (examId.includes('medecine')) {
    // Convert medecine-2024 to medecine2024 to match the actual directory structure
    const sanitizedExamId = examId.replace('-', '');
    const year = examId.match(/\d{4}/)?.[0] || '';
    
    return import(`../../../concours/medecine/${sanitizedExamId}/correction_${year}.json`)
      .then(module => module.default)
      .catch(error => {
        console.error("Error loading correction data:", error);
        throw new Error(`Failed to load correction data for ${examId}: ${error.message}`);
      });
  }
  
  // Case for engineering entrance exams (ENSA/ENSAM)
  if (examId && (examId.includes('ensa') || examId.includes('ensam'))) {
    if (!subject) {
      throw new Error("Subject is required for ENSA/ENSAM corrections");
    }
    
    return import(`../../../concours/${examId.includes('ensa') ? 'ensa' : 'ensam'}/${examId}/correction_${subject}.json`)
      .then(module => module.default)
      .catch(error => {
        console.error("Error loading correction data:", error);
        throw new Error(`Failed to load correction data for ${examId}/${subject}: ${error.message}`);
      });
  }
  
  // Case for other exam types (can be extended as needed)
  throw new Error(`Unsupported exam type: ${examId}`);
};

// Function to calculate score and analyze user performance
const calculateResults = (correctionData: CorrectionData, userAnswers: Record<string, string>) => {
  // Initialize counters
  let totalQuestions = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let notAnsweredCount = 0;
  let totalScore = 0;
  let maxPossibleScore = 0;
  let partialAnswers = 0; // Questions with partial credit
  
  // Track scores by topic for strengths/weaknesses analysis
  const topicScores: Record<string, { correct: number; total: number; score: number; maxScore: number }> = {};
  
  // Additional statistics
  const timePerQuestion = 2.5; // minutes (average)
  const performance = {
    timeEfficiency: 0,
    accuracy: 0,
    completionRate: 0,
    difficultyRating: 0
  };
  
  // Process each component and its questions
  const processedQuestions = [];
  
  for (const component of correctionData.components) {
    const componentCoefficient = component.coefficient || 1;
    const topicName = component.component_name;
    
    // Initialize topic scores if not already present
    if (!topicScores[topicName]) {
      topicScores[topicName] = { correct: 0, total: 0, score: 0, maxScore: 0 };
    }
    
    // Process each question in this component
    for (const question of component.questions) {
      totalQuestions++;
      const questionNumber = question.question_number;
      
      // Utiliser le numéro de question comme clé directe ou comme chaîne
      // Si questionNumber est '1' ou 1, essayer les deux versions
      let userAnswer = userAnswers[questionNumber] || '';
      if (!userAnswer && typeof questionNumber === 'string' && !isNaN(Number(questionNumber))) {
        userAnswer = userAnswers[Number(questionNumber)] || '';
      } else if (!userAnswer && typeof questionNumber === 'number') {
        userAnswer = userAnswers[String(questionNumber)] || '';
      }
      
      const isCorrect = userAnswer === question.correct_option;
      
      // Calculate base score and apply coefficient
      const questionMaxScore = 1 * componentCoefficient;
      let questionScore = 0;
      
      if (isCorrect) {
        questionScore = questionMaxScore;
        correctAnswers++;
        topicScores[topicName].correct += 1;
      } else if (userAnswer) {
        // Check for partial credit (could be extended with more complex logic)
        // For now, we're just assuming wrong answers get 0
        questionScore = 0;
        wrongAnswers++;
      } else {
        questionScore = 0;
        notAnsweredCount++;
      }
      
      // Update topic scores
      topicScores[topicName].total += 1;
      topicScores[topicName].score += questionScore;
      topicScores[topicName].maxScore += questionMaxScore;
      
      // Update overall scores
      totalScore += questionScore;
      maxPossibleScore += questionMaxScore;
      
      // Add to processed questions list with more detailed user-friendly answers
      // Trouver le texte de l'option correcte au lieu du simple identifiant
      let correctAnswerText = "";
      let userAnswerText = "";
      
      // Récupérer le texte de la réponse correcte
      if (question.options && Array.isArray(question.options)) {
        const correctOption = question.options.find(opt => opt.label === question.correct_option);
        if (correctOption) {
          correctAnswerText = correctOption.text || question.correct_option;
        } else {
          correctAnswerText = question.correct_option;
        }
        
        // Récupérer le texte de la réponse utilisateur
        if (userAnswer) {
          const userOption = question.options.find(opt => opt.label === userAnswer);
          if (userOption) {
            userAnswerText = userOption.text || userAnswer;
          } else {
            userAnswerText = userAnswer;
          }
        } else {
          userAnswerText = "Aucune réponse";
        }
      } else {
        correctAnswerText = question.correct_option;
        userAnswerText = userAnswer || "Aucune réponse";
      }
      
      processedQuestions.push({
        id: questionNumber,
        question_number: question.question_number,
        text: question.text,
        userAnswer: userAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect,
        score: questionScore,
        maxScore: questionMaxScore,
        explanation: question.explanation,
        feedback: isCorrect ? 
          "Bonne réponse !" : 
          userAnswer ? 
            "Réponse incorrecte. Revoyez l'explication pour comprendre le concept." : 
            "Vous n'avez pas répondu à cette question."
      });
    }
  }
  
  // Calculate performance metrics
  performance.accuracy = (correctAnswers / totalQuestions) * 100;
  performance.completionRate = ((totalQuestions - notAnsweredCount) / totalQuestions) * 100;
  performance.timeEfficiency = timePerQuestion * (totalQuestions - notAnsweredCount);
  performance.difficultyRating = Math.round(100 - performance.accuracy); // Simple inverse of accuracy as difficulty proxy
  
  // Format topic scores for charts
  const topicPerformance = Object.entries(topicScores).map(([topic, scores]) => {
    const percentage = scores.maxScore > 0 ? (scores.score / scores.maxScore) * 100 : 0;
    return { 
      topic, 
      percentage: Math.round(percentage), 
      score: scores.score, 
      maxScore: scores.maxScore,
      correct: scores.correct,
      total: scores.total
    };
  });
  
  // Sort by percentage to find strengths and weaknesses
  const sortedTopics = [...topicPerformance].sort((a, b) => b.percentage - a.percentage);
  
  // Get top strengths and weaknesses
  const strengths = sortedTopics.filter(topic => topic.percentage >= 50)
    .slice(0, 3)
    .map(topic => topic.topic);
  
  const weaknesses = [...sortedTopics]
    .filter(topic => topic.percentage < 50)
    .slice(0, 3)
    .map(topic => topic.topic);
  
  // Generate detailed feedback and recommendations
  let feedback = '';
  const recommendations = [];
  const detailedRecommendations = {};
  
  // Overall performance assessment
  if (correctAnswers / totalQuestions >= 0.7) {
    feedback += `Félicitations ! Vous avez obtenu un excellent score de ${Math.round((totalScore / maxPossibleScore) * 100)}%. `;
  } else if (correctAnswers / totalQuestions >= 0.5) {
    feedback += `Vous avez obtenu un score satisfaisant de ${Math.round((totalScore / maxPossibleScore) * 100)}%. Vous êtes sur la bonne voie ! `;
  } else {
    feedback += `Vous avez obtenu un score de ${Math.round((totalScore / maxPossibleScore) * 100)}%. Il y a plusieurs points à améliorer pour progresser. `;
  }
  
  // Strengths and weaknesses feedback
  if (strengths.length > 0) {
    feedback += `Vos points forts sont : ${strengths.join(', ')}. `;
  }
  
  if (weaknesses.length > 0) {
    feedback += `Vous devriez concentrer vos efforts sur : ${weaknesses.join(', ')}. `;
  }
  
  // Recommendations based on performance
  if (correctAnswers / totalQuestions >= 0.7) {
    recommendations.push('Consolidez vos connaissances en revoyant les questions que vous avez manquées.');
    recommendations.push('Approfondissez les concepts avancés dans vos domaines de force pour vous démarquer davantage.');
  } else if (correctAnswers / totalQuestions >= 0.5) {
    recommendations.push('Concentrez-vous sur les thèmes où vous avez le plus de difficultés.');
    recommendations.push('Pratiquez régulièrement avec des exercices similaires pour améliorer votre rapidité.');
    
    // Add specific recommendations for weaknesses
    weaknesses.forEach(weakness => {
      recommendations.push(`Revoyez les concepts fondamentaux en ${weakness}.`);
    });
  } else {
    recommendations.push('Établissez un plan d\'études structuré pour couvrir systématiquement les sujets difficiles.');
    recommendations.push('Utilisez des fiches de révision pour mémoriser les concepts essentiels.');
    recommendations.push('Cherchez des ressources pédagogiques supplémentaires ou envisagez un tutorat pour les sujets les plus problématiques.');
    weaknesses.forEach(weakness => {
      recommendations.push(`Accordez plus de temps à l\'étude de ${weakness} et commencez par les concepts de base.`);
    });
  }
  
  // Create detailed topic-specific recommendations
  topicPerformance.forEach(topic => {
    if (topic.percentage < 50) {
      detailedRecommendations[topic.topic] = [
        `Revoir les concepts fondamentaux de ${topic.topic}.`,
        `Faire plus d'exercices pratiques en ${topic.topic}.`,
        `Consulter des ressources supplémentaires sur ${topic.topic}.`
      ];
    } else if (topic.percentage < 70) {
      detailedRecommendations[topic.topic] = [
        `Renforcer certains aspects de ${topic.topic}.`,
        `Pratiquer des exercices plus complexes en ${topic.topic}.`
      ];
    } else {
      detailedRecommendations[topic.topic] = [
        `Continuer à maintenir votre excellent niveau en ${topic.topic}.`,
        `Explorer des concepts avancés en ${topic.topic}.`
      ];
    }
  });
  
  // Add time management recommendations if needed
  if (notAnsweredCount > totalQuestions * 0.2) {
    recommendations.push('Améliorez votre gestion du temps pendant l\'examen. Priorisez les questions auxquelles vous savez répondre rapidement.');
  }
  
  // Return the complete analysis with extended data
  return {
    score: totalScore,
    maxScore: maxPossibleScore,
    scorePercentage: Math.round((totalScore / maxPossibleScore) * 100),
    totalQuestions,
    correctAnswers,
    incorrectAnswers: wrongAnswers, // Renommé pour correspondre à l'utilisation dans l'affichage
    notAnsweredCount,
    partialAnswers,
    strengths,
    weaknesses,
    feedback,
    recommendations,
    detailedRecommendations,
    topicScores: topicPerformance, // For charts
    performance,
    questions: processedQuestions
  };
};

// Main Correction component
const Correction = () => {
  const { id, subject } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctionData, setCorrectionData] = useState<CorrectionData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  
  // Load correction data and user answers
  useEffect(() => {
    const fetchCorrectionData = async () => {
      if (!id) {
        setError("Aucun identifiant d'examen fourni");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Load correction data
        const data = await loadCorrectionData(id, subject);
        setCorrectionData(data);
        
        // Get user answers from localStorage
        const answersKey = `answers_${id}${subject ? `_${subject}` : ''}`;
        const savedAnswers = localStorage.getItem(answersKey);
        
        if (savedAnswers) {
          const parsedData: UserAnswers = JSON.parse(savedAnswers);
          setUserAnswers(parsedData.answers);
          
          // Calculate results
          const calculatedResults = calculateResults(data, parsedData.answers);
          setResults(calculatedResults);
        } else {
          setError("Aucune réponse trouvée pour cet examen. Veuillez d'abord compléter l'examen.");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des corrections:", error);
        setError(`Erreur lors du chargement des corrections: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setIsLoading(false);
        
        // Use mock data as fallback
        setResults(mockCorrection);
      }
    };
    
    fetchCorrectionData();
  }, [id, subject]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-muted/20 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-muted-foreground">Chargement de votre correction...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !results) {
    return (
      <div className="bg-muted/20 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-background/70 rounded-lg border border-border/30 p-8 shadow-md text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Erreur lors du chargement</h2>
            <p className="text-muted-foreground mb-6">{error || "Impossible de charger les données de correction"}</p>
            <Link to="/user/exams">
              <Button variant="default">
                <ArrowRight className="w-4 h-4 mr-2" />
                Retour aux examens
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use the results from dynamic data
  const correction = results;

  // Calculate the score color based on the value
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  // Calculate the score ring color based on the value
  const getScoreRingColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-600";
    return "bg-gradient-to-r from-red-500 to-rose-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-6 sm:px-10 md:px-16 lg:px-24 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-24 left-0 w-60 h-60 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-poppins font-bold text-foreground">
                    Résultats et Correction
                  </h1>
                  <p className="text-muted-foreground">
                    {correctionData?.exam_title || id?.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'Concours'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-full border-border/40 hover:bg-primary/5 hover:border-primary/30">
                  <Download className="h-4 w-4" /> 
                  <span className="hidden sm:inline">Télécharger</span>
                </Button>
                <Button asChild className="gap-2 rounded-full">
                  <Link to="/dashboard">
                    <span className="hidden sm:inline">Tous les concours</span>
                    <span className="inline sm:hidden">Retour</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 w-full">
            {/* Main score card */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden lg:col-span-3 w-full">
              <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
              <CardContent className="p-6 w-full max-w-full">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-full">
                  <div className="relative flex-shrink-0">
                    <div className="relative">
                      <CircularProgress value={correction.score} max={correction.maxScore} />
                      <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 w-10 h-10 rounded-full shadow-md flex items-center justify-center border-2 border-background">
                        {correction.score >= 60 ? (
                          <Sparkles className="h-5 w-5 text-amber-500" />
                        ) : (
                          <Brain className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow w-full">
                    <div className="flex flex-col gap-4 w-full">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Résumé de vos résultats
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {correction.correctAnswers}
                              </div>
                              <p className="text-muted-foreground">Réponses correctes</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                                {correction.incorrectAnswers}
                              </div>
                              <p className="text-muted-foreground">Réponses incorrectes</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                {correction.notAnsweredCount}
                              </div>
                              <p className="text-muted-foreground">Réponses non données</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Score
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {correction.score}
                              </div>
                              <p className="text-muted-foreground">Score</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                                {correction.maxScore}
                              </div>
                              <p className="text-muted-foreground">Score maximum</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                {Math.round(correction.score / correction.maxScore * 100)}%
                              </div>
                              <p className="text-muted-foreground">Pourcentage</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques détaillées et graphiques */}
          <h2 className="text-xl font-poppins font-medium text-foreground mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Statistiques détaillées
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Répartition des réponses */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Répartition des réponses</CardTitle>
                <CardDescription>Vue d'ensemble de votre performance</CardDescription>
              </CardHeader>
              <CardContent>
                <AnswersPieChart 
                  correctAnswers={correction.correctAnswers} 
                  wrongAnswers={correction.incorrectAnswers} 
                  notAnswered={correction.notAnsweredCount} 
                />
              </CardContent>
            </Card>

            {/* Performance par matière */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Performance par matière</CardTitle>
                <CardDescription>Forces et faiblesses par sujet</CardDescription>
              </CardHeader>
              <CardContent>
                <TopicBarChart topicScores={correction.topicScores || []} />
              </CardContent>
            </Card>

            {/* Graphique radar des forces et faiblesses */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Analyse des compétences</CardTitle>
                <CardDescription>Radar des forces et faiblesses</CardDescription>
              </CardHeader>
              <CardContent>
                <StrengthsWeaknessesRadarChart topicScores={correction.topicScores || []} />
              </CardContent>
            </Card>

            {/* Recommandations personnalisées */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Recommandations personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{correction.feedback}</p>
                  <ul className="space-y-2">
                    {correction.recommendations?.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5"><ArrowRight className="h-3.5 w-3.5 text-primary" /></div>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed correction */}
          <h2 className="text-xl font-poppins font-medium text-foreground">
            Correction détaillée
          </h2>
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-muted/50 p-1 rounded-lg mb-6">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="correct" className="rounded-md data-[state=active]:bg-background">
                Correctes
              </TabsTrigger>
              <TabsTrigger value="incorrect" className="rounded-md data-[state=active]:bg-background">
                Incorrectes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-6">
              {correction.questions.map((question, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all",
                  )}
                >
                  <div className={cn(
                    "h-1.5",
                    question.isCorrect 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                      : question.score 
                        ? "bg-gradient-to-r from-amber-500 to-yellow-600" 
                        : "bg-gradient-to-r from-red-500 to-rose-600"
                  )}></div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          question.isCorrect 
                            ? "bg-green-100 dark:bg-green-900/30" 
                            : question.score 
                              ? "bg-amber-100 dark:bg-amber-900/30" 
                              : "bg-red-100 dark:bg-red-900/30"
                        )}>
                          <span className={cn(
                            "font-bold",
                            question.isCorrect 
                              ? "text-green-600 dark:text-green-400" 
                              : question.score 
                                ? "text-amber-600 dark:text-amber-400" 
                                : "text-red-600 dark:text-red-400"
                          )}>{question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}</span>
                        </div>
                        Question {question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}
                      </CardTitle>
                      {question.isCorrect ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Correcte
                        </Badge>
                      ) : question.score ? (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Partiellement correcte ({question.score}/{question.maxScore})
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none">
                          <XCircle className="h-3 w-3 mr-1" />
                          Incorrecte
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2"><MathRenderer text={question.text} /></CardDescription>                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/60">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <BookmarkIcon className="h-3 w-3" /> Votre réponse:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.userAnswer} /></p>                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Réponse correcte:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.correctAnswer} /></p>
                      </div>
                        </div>
                    {question.feedback && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                          <Dices className="h-3 w-3" /> Feedback:
                        </h4>
                        <p className="text-sm">{question.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-6">
                    <div className="w-full">
                      <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                        <Brain className="h-3 w-3" /> Explication détaillée:
                      </h4>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-sm"><MathRenderer text={question.explanation} /></p>                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="correct" className="space-y-6">
              {correction.questions.filter(q => q.isCorrect).map((question, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="font-bold text-green-600 dark:text-green-400">{question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}</span>
                        </div>
                        Question {question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Correcte
                      </Badge>
                    </div>
                    <CardDescription className="mt-2"><MathRenderer text={question.text} /></CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/60">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <BookmarkIcon className="h-3 w-3" /> Votre réponse:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.userAnswer} /></p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Réponse correcte:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.correctAnswer} /></p>
                      </div>
                    </div>
                    {question.feedback && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                          <Dices className="h-3 w-3" /> Feedback:
                        </h4>
                        <p className="text-sm">{question.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-6">
                    <div className="w-full">
                      <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                        <Brain className="h-3 w-3" /> Explication détaillée:
                      </h4>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm"><MathRenderer text={question.explanation} /></p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="incorrect" className="space-y-6">
              {correction.questions.filter(q => !q.isCorrect && !q.score).map((question, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <span className="font-bold text-red-600 dark:text-red-400">{question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}</span>
                        </div>
                        Question {question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}
                      </CardTitle>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none">
                        <XCircle className="h-3 w-3 mr-1" />
                        Incorrecte
                      </Badge>
                    </div>
                    <CardDescription className="mt-2"><MathRenderer text={question.text} /></CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/60">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <BookmarkIcon className="h-3 w-3" /> Votre réponse:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.userAnswer} /></p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Réponse correcte:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.correctAnswer} /></p>
                      </div>
                    </div>
                    {question.feedback && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                          <Dices className="h-3 w-3" /> Feedback:
                        </h4>
                        <p className="text-sm">{question.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-6">
                    <div className="w-full">
                      <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                        <Brain className="h-3 w-3" /> Explication détaillée:
                      </h4>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm"><MathRenderer text={question.explanation} /></p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="partial" className="space-y-6">
              {correction.questions.filter(q => !q.isCorrect && q.score).map((question, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-1.5 bg-gradient-to-r from-amber-500 to-yellow-600"></div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <span className="font-bold text-amber-600 dark:text-amber-400">{question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}</span>
                        </div>
                        Question {question.question_number ? question.question_number.replace(/\D/g, '') : (index + 1)}
                      </CardTitle>
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Partiellement correcte ({question.score}/{question.maxScore})
                      </Badge>
                    </div>
                    <CardDescription className="mt-2"><MathRenderer text={question.text} /></CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/60">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <BookmarkIcon className="h-3 w-3" /> Votre réponse:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.userAnswer} /></p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Réponse correcte:
                        </h4>
                        <p className="text-sm"><MathRenderer text={question.correctAnswer} /></p>
                      </div>
                    </div>
                    {question.feedback && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                          <Dices className="h-3 w-3" /> Feedback:
                        </h4>
                        <p className="text-sm">{question.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-6">
                    <div className="w-full">
                      <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                        <Brain className="h-3 w-3" /> Explication détaillée:
                      </h4>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm"><MathRenderer text={question.explanation} /></p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
          
          {/* Call to action */}
          <div className="bg-gradient-to-r from-primary/80 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Continuez votre progression</h3>
                <p className="text-white/80 max-w-md">
                  Passez à un autre concours pour améliorer vos compétences et augmenter vos chances de réussite.
                </p>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 whitespace-nowrap rounded-full">
                Prochain concours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Correction;
