import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronRight, Building, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { University } from "@/models/concours";
import { Badge } from "@/components/ui/badge";
import { getConcoursByUniversity } from "@/models/concours";

interface UniversityCardProps {
  university: University;
  onClick: (universityId: string) => void;
}

const UniversityCard = ({ university, onClick }: UniversityCardProps) => {
  // Get the number of concours for this university
  const concours = getConcoursByUniversity(university.id);
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 border-border/40 hover:shadow-lg hover:border-primary/50 cursor-pointer group relative"
      onClick={() => onClick(university.id)}
    >
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      <div className="h-1 bg-gradient-to-r from-primary to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-poppins font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {university.name}
            </h3>
          </div>
          <Badge variant="outline" className="bg-primary/5 border-primary/20">
            <BookOpen className="h-3 w-3 mr-1" />
            {concours.length} concours
          </Badge>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm mb-3 ml-1">
          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-primary/70" />
          <span>{university.location}</span>
        </div>
        
        {university.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 ml-1">
            {university.description}
          </p>
        )}
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80 hover:bg-primary/10 -mr-2 group-hover:bg-primary/10 transition-colors duration-300"
          >
            Voir les concours
            <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityCard; 