
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, ChevronRight, Download, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
    // Plus de questions...
  ]
};

const Correction = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-dark-gray mb-1">
                Résultats et Correction
              </h1>
              <p className="text-gray-600">
                Concours CNC - Mathématiques 2023
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Télécharger PDF
              </Button>
              <Button asChild className="bg-royal-blue hover:bg-blue-700">
                <Link to="/dashboard">
                  Tous les concours <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Score Overview Card */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Score global</CardTitle>
              <CardDescription>
                Votre performance sur l'ensemble du concours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-24 h-24 rounded-full border-8 border-royal-blue flex items-center justify-center bg-white">
                    <span className="text-3xl font-bold text-royal-blue">{mockCorrection.score}%</span>
                  </div>
                  <div className="ml-6">
                    <p className="text-sm text-gray-600 mb-1">
                      Note: {mockCorrection.score}/{mockCorrection.maxScore}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mockCorrection.correctAnswers} correctes, {mockCorrection.partialAnswers} partielles, {mockCorrection.wrongAnswers} incorrectes
                    </p>
                  </div>
                </div>
                <div className="md:border-l md:pl-6 flex items-center">
                  <div>
                    <h3 className="font-medium mb-2">Vos points forts</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockCorrection.strengths.map((strength, i) => (
                        <span key={i} className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                          {strength}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-medium mb-2 mt-4">À améliorer</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockCorrection.weaknesses.map((weakness, i) => (
                        <span key={i} className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IA Feedback Card */}
          <Card className="mb-8 border-l-4 border-royal-blue">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-royal-blue" /> 
                Feedback personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                {mockCorrection.feedback}
              </p>
              <h3 className="text-lg font-medium mb-3">Recommandations</h3>
              <ul className="space-y-2">
                {mockCorrection.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-5 w-5 bg-royal-blue text-white rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                      {index + 1}
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Correction */}
          <h2 className="text-xl font-poppins font-semibold text-dark-gray mb-4">
            Correction détaillée
          </h2>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="correct">Correctes</TabsTrigger>
              <TabsTrigger value="incorrect">Incorrectes</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-6 space-y-6">
              {mockCorrection.questions.map((question, index) => (
                <Card key={index} className={`border-l-4 ${question.isCorrect ? 'border-green-500' : question.score ? 'border-yellow-500' : 'border-red-500'}`}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      {question.isCorrect ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                          Correcte
                        </span>
                      ) : question.score ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full">
                          Partiellement correcte ({question.score}/{question.maxScore})
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full">
                          Incorrecte
                        </span>
                      )}
                    </div>
                    <CardDescription>{question.text}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Votre réponse:</h4>
                      <p className="bg-gray-50 p-3 rounded">{question.userAnswer}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Réponse correcte:</h4>
                      <p className="bg-green-50 p-3 rounded">{question.correctAnswer}</p>
                    </div>
                    {question.feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback:</h4>
                        <p className="text-gray-700">{question.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-3 pb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Explication détaillée:</h4>
                      <p className="text-gray-700 text-sm">{question.explanation}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="correct" className="pt-6 space-y-6">
              {mockCorrection.questions.filter(q => q.isCorrect).map((question, index) => (
                <Card key={index} className="border-l-4 border-green-500">
                  {/* Same content structure as above */}
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                        Correcte
                      </span>
                    </div>
                    <CardDescription>{question.text}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Question content */}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="incorrect" className="pt-6 space-y-6">
              {mockCorrection.questions.filter(q => !q.isCorrect).map((question, index) => (
                <Card key={index} className={`border-l-4 ${question.score ? 'border-yellow-500' : 'border-red-500'}`}>
                  {/* Same content structure as above */}
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      {question.score ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full">
                          Partiellement correcte ({question.score}/{question.maxScore})
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full">
                          Incorrecte
                        </span>
                      )}
                    </div>
                    <CardDescription>{question.text}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Question content */}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
          
          {/* Next Steps */}
          <Card className="bg-royal-blue text-white">
            <CardHeader>
              <CardTitle>Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Exercices recommandés</h3>
                  <p className="text-blue-100">Pratiquez des exercices ciblant vos points faibles.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Concours similaires</h3>
                  <p className="text-blue-100">Essayez d'autres concours du même niveau.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Ressources</h3>
                  <p className="text-blue-100">Accédez à des cours et des fiches de révision.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Voir mes recommandations complètes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Correction;
