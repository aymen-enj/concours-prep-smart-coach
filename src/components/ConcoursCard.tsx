import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, Calendar, GraduationCap, Lock, PlayCircle, Sparkles, Star, CalendarDays, CheckCircle, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { ConcoursItem } from "@/models/concours";

interface ConcoursCardProps {
  concours: ConcoursItem;
}

const ConcoursCard = ({ concours }: ConcoursCardProps) => {
  const navigate = useNavigate();
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);

  const handleCardClick = () => {
    // Si le concours a plusieurs matières, ouvrir le dialogue de sélection
    if (concours.subjects && concours.subjects.length > 0) {
      setIsSubjectDialogOpen(true);
    } else {
      // Sinon, naviguer directement vers l'examen
      navigate(`/exam-view/${concours.id}`);
    }
  };

  const handleSubjectSelect = (subjectId: string) => {
    setIsSubjectDialogOpen(false);
    // Inclure l'ID du sujet dans l'URL pour permettre à ExamView de charger le bon fichier
    navigate(`/exam-view/${concours.id}/${subjectId}`);
  };

  return (
    <>
      <Card 
        className={`overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border-border/40 group ${!concours.hasAccess ? 'opacity-80' : ''}`}
        onClick={handleCardClick}
      >
        <div className="h-1 bg-gradient-to-r from-primary to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {concours.title}
            </h3>
            {concours.isPaid ? (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none">
                Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">
                Gratuit
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
              <span>Année {concours.year}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
              <span>{concours.subject}</span>
            </div>
          </div>
          
          {concours.hasAccess ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                <span>Accès autorisé</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80 hover:bg-primary/10 -mr-2"
              >
                {concours.subjects && concours.subjects.length > 0 ? "Choisir matière" : "Commencer"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Lock className="h-3.5 w-3.5 mr-1" />
                <span>Accès restreint</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary/40 text-primary hover:bg-primary/5"
              >
                Débloquer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for subject selection */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choisissez une matière</DialogTitle>
            <DialogDescription>
              Sélectionnez la matière du concours {concours.title} que vous souhaitez passer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {concours.subjects?.map((subject) => (
              <Button 
                key={subject.id} 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/30 transition-colors"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-xs text-muted-foreground">Concours {concours.year}</div>
                  </div>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConcoursCard;
