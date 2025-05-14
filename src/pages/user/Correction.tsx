import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, ChevronRight, Download, FileText, CheckCircle, XCircle, AlertCircle, Trophy, Brain, Target, Book, BookOpen, Sparkles, ArrowRight, LightbulbIcon, BookmarkIcon, Dices, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock correction data
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

const Correction = () => {
  const { id } = useParams();

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
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-24 left-0 w-60 h-60 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto">
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
                Concours CNC - Mathématiques 2023
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
                    <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              </div>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Main score card */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden lg:col-span-2">
              <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600"></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className={`w-32 h-32 rounded-full ${getScoreRingColor(mockCorrection.score)} flex items-center justify-center shadow-lg`}>
                      <div className="w-28 h-28 rounded-full bg-background flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(mockCorrection.score)}`}>
                          {mockCorrection.score}%
                        </span>
                        <span className="text-xs text-muted-foreground">Score global</span>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 w-10 h-10 rounded-full shadow-md flex items-center justify-center border-2 border-background">
                      {mockCorrection.score >= 60 ? (
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Brain className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col gap-4">
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
                                {mockCorrection.correctAnswers}
                              </div>
                              <div className="text-xs text-green-700 dark:text-green-300">Réponses correctes</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                {mockCorrection.partialAnswers}
                              </div>
                              <div className="text-xs text-amber-700 dark:text-amber-300">Réponses partielles</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                                {mockCorrection.wrongAnswers}
                              </div>
                              <div className="text-xs text-red-700 dark:text-red-300">Réponses incorrectes</div>
                            </div>
                          </div>
                  </div>
                </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-green-500" />
                            Points forts
                          </h3>
                    <div className="flex flex-wrap gap-2">
                      {mockCorrection.strengths.map((strength, i) => (
                              <Badge key={i} variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-800/30">
                          {strength}
                              </Badge>
                      ))}
                    </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4 text-red-500" />
                            À améliorer
                          </h3>
                    <div className="flex flex-wrap gap-2">
                      {mockCorrection.weaknesses.map((weakness, i) => (
                              <Badge key={i} variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30">
                          {weakness}
                              </Badge>
                      ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional stats */}
            <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 to-yellow-600"></div>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-amber-500" />
                  Statistiques
                </h3>
                <div className="flex flex-col gap-4">
                  {additionalStats.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-border/30 last:border-0 last:pb-0">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* IA Feedback Card */}
          <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden mb-10 relative">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-primary"></div>
            <div className="absolute top-0 right-0 h-20 w-20 bg-primary/5 rounded-bl-full -z-10"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-poppins font-medium text-foreground">
                Feedback personnalisé
                </h2>
              </div>
              <p className="text-foreground mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                {mockCorrection.feedback}
              </p>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 text-amber-500" />
                Recommandations pour progresser
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockCorrection.recommendations.map((recommendation, index) => (
                  <Card key={index} className="border-border/30 hover:border-primary/20 transition-all bg-background/70 shadow-sm">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-sm">{recommendation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Correction */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-poppins font-medium text-foreground">
            Correction détaillée
          </h2>
          </div>
          
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
              <TabsTrigger value="partial" className="rounded-md data-[state=active]:bg-background">
                Partielles
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-6">
              {mockCorrection.questions.map((question, index) => (
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
                          )}>{index + 1}</span>
                        </div>
                        Question {index + 1}
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
                    <CardDescription className="mt-2">{question.text}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/60">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <BookmarkIcon className="h-3 w-3" /> Votre réponse:
                        </h4>
                        <p className="text-sm">{question.userAnswer}</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Réponse correcte:
                        </h4>
                        <p className="text-sm">{question.correctAnswer}</p>
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
                        <p className="text-sm">{question.explanation}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="correct" className="space-y-6">
              {mockCorrection.questions.filter(q => q.isCorrect).map((question, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                  {/* Similar content to "all" tab, but filtered */}
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="font-bold text-green-600 dark:text-green-400">{index + 1}</span>
                        </div>
                        Question {index + 1}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Correcte
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">{question.text}</CardDescription>
                  </CardHeader>
                  {/* Rest of the content similar to "all" tab */}
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="incorrect" className="space-y-6">
              {mockCorrection.questions.filter(q => !q.isCorrect && !q.score).map((question, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                  {/* Similar content to "all" tab, but filtered */}
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="partial" className="space-y-6">
              {mockCorrection.questions.filter(q => !q.isCorrect && q.score).map((question, index) => (
                <Card 
                  key={index} 
                  className="border-border/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="h-1.5 bg-gradient-to-r from-amber-500 to-yellow-600"></div>
                  {/* Similar content to "all" tab, but filtered */}
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
