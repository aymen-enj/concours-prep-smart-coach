import { Card, CardContent } from "@/components/ui/card";
import { EducationLevel, educationLevels } from "@/models/concours";
import { GraduationCap, School, BookOpen, Award, Calculator, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EducationLevelSelectorProps {
  selectedLevel: EducationLevel | null;
  onSelectLevel: (level: EducationLevel) => void;
}

// Function to get icon based on education level
const getLevelIcon = (level: EducationLevel) => {
  switch (level) {
    case 'Bac':
      return School;
    case 'Bac+2':
      return BookOpen;
    case 'Bac+3':
      return Award;
    case 'Bac+5':
      return GraduationCap;
    case 'Classes préparatoires':
      return Calculator;
    default:
      return GraduationCap;
  }
};

// Function to get level description
const getLevelDescription = (level: EducationLevel) => {
  switch(level) {
    case 'Bac':
      return 'Concours d\'admission après le baccalauréat';
    case 'Bac+2':
      return 'Concours après deux années d\'études supérieures';
    case 'Bac+3':
      return 'Concours après licence ou équivalent';
    case 'Bac+5':
      return 'Concours après master ou équivalent';
    case 'Classes préparatoires':
      return 'Concours des grandes écoles après CPGE';
    default:
      return '';
  }
};

// Function to get level color
const getLevelColor = (level: EducationLevel) => {
  switch(level) {
    case 'Bac':
      return 'from-blue-600 to-blue-400';
    case 'Bac+2':
      return 'from-green-600 to-green-400';
    case 'Bac+3':
      return 'from-amber-600 to-amber-400';
    case 'Bac+5':
      return 'from-purple-600 to-purple-400';
    case 'Classes préparatoires':
      return 'from-red-600 to-red-400';
    default:
      return 'from-primary to-blue-600';
  }
};

const EducationLevelSelector = ({ selectedLevel, onSelectLevel }: EducationLevelSelectorProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {educationLevels.map((level) => {
        const Icon = getLevelIcon(level);
        const gradientColor = getLevelColor(level);
        
        return (
          <Card 
            key={level}
            className={`
              cursor-pointer transition-all duration-300 overflow-hidden group relative
              hover:shadow-lg hover:border-primary/50
              ${selectedLevel === level ? 'border-primary shadow-md' : 'border-border/40'}
            `}
            onClick={() => onSelectLevel(level)}
          >
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <CardContent className="p-0">
              <div className={`h-2 transition-all duration-300 group-hover:h-3 bg-gradient-to-r ${gradientColor}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors duration-300">
                      {level}
                    </h3>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 border-primary/20">
                    {level === 'Bac' ? 'Niveau 0' : 
                     level === 'Bac+2' ? 'Niveau 1' : 
                     level === 'Bac+3' ? 'Niveau 2' : 
                     level === 'Bac+5' ? 'Niveau 3' : 'CPGE'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {getLevelDescription(level)}
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EducationLevelSelector; 