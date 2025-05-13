import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, Calendar, GraduationCap, Lock, PlayCircle } from "lucide-react";

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
    <Card className="content-card overflow-hidden h-full transition-all hover:shadow-md hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-poppins font-semibold text-lg text-foreground mb-1">
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
            className={isPaid 
              ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30" 
              : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            }
          >
            {isPaid ? "Premium" : "Gratuit"}
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
          <Button asChild className="w-full btn-primary">
            <Link to={`/concours/${id}`} className="flex items-center justify-center">
              <PlayCircle className="h-4 w-4 mr-2" />
              Commencer
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
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
