import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, Calendar, GraduationCap, Lock, PlayCircle, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConcoursCardProps {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string;
  isPaid: boolean;
  hasAccess: boolean;
}

const ConcoursCard = ({
  id,
  title,
  subject,
  year,
  level,
  isPaid,
  hasAccess,
}: ConcoursCardProps) => {
  return (
    <Card className="content-card overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 group relative">
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      <div className="h-1 bg-gradient-to-r from-primary to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-poppins font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              <span>{subject}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{year}</span>
            </div>
          </div>
          <Badge 
            variant={isPaid ? "default" : "outline"} 
            className={cn(
              "transition-all duration-300",
              isPaid 
                ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 group-hover:bg-primary/30" 
                : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            )}
          >
            {isPaid ? (
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Premium
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> Gratuit
              </span>
            )}
          </Badge>
        </div>
        <div className="mb-3 flex items-center">
          <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <span className="text-sm text-muted-foreground">Niveau:</span>
            <span className="text-sm font-medium text-foreground ml-1">{level}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        {hasAccess ? (
          <Button asChild className="w-full group-hover:shadow-md transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-primary">
            <Link to={`/exam-view/${id}`} className="flex items-center justify-center">
              <PlayCircle className="h-4 w-4 mr-2" />
              Commencer
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
            <Link to="/payment" className="flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2" />
              Débloquer
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConcoursCard;
