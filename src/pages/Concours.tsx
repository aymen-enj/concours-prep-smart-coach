
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";

// Mock data for concours questions
const mockQuestions = [
  {
    id: "q1",
    type: "qcm",
    text: "Quelle est la limite de f(x) = (1+x)^(1/x) quand x tend vers 0 ?",
    options: ["e", "1", "0", "∞"],
    correctAnswer: "e",
  },
  {
    id: "q2",
    type: "text",
    text: "Démontrez que la suite définie par u_n+1 = (u_n + a/u_n)/2 avec u_1 > 0 et a > 0 converge vers √a.",
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
  },
  {
    id: "q4",
    type: "latex",
    text: "Calculez l'intégrale suivante : $\\int_{0}^{\\pi} \\sin(x) \\, dx$",
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
  },
];

const Concours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  
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
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would send the answers to a server
    console.log("Submitting answers:", answers);
    toast({
      title: "Concours terminé",
      description: "Vos réponses ont été soumises avec succès.",
    });
    navigate(`/correction/${id}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const question = mockQuestions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-poppins font-bold text-dark-gray">
                  {concours.title}
                </h1>
                <p className="text-gray-600">Année: {concours.year}</p>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="mr-2 h-5 w-5" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="mb-6">
              <Progress value={(currentQuestion + 1) / concours.totalQuestions * 100} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Question {currentQuestion + 1} sur {concours.totalQuestions}</span>
                <span>{Math.round((currentQuestion + 1) / concours.totalQuestions * 100)}% terminé</span>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">
                  {question.text}
                </h2>

                {question.type === "qcm" && (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswer(question.id, value)}
                    className="space-y-3"
                  >
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {(question.type === "text" || question.type === "latex") && (
                  <Textarea
                    placeholder="Votre réponse ici..."
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="min-h-[120px]"
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>

              {currentQuestion < concours.totalQuestions - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center bg-royal-blue hover:bg-blue-700"
                >
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Terminer et soumettre
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Concours;
