import { University } from "@/models/concours";
import UniversityCard from "./UniversityCard";
import { Building } from "lucide-react";

interface UniversityListProps {
  universities: University[];
  onSelectUniversity: (universityId: string) => void;
}

const UniversityList = ({ universities, onSelectUniversity }: UniversityListProps) => {
  if (universities.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune université trouvée</h3>
        <p className="text-muted-foreground">
          Aucune université n'est disponible pour ce niveau d'études.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {universities.map((university) => (
        <UniversityCard 
          key={university.id} 
          university={university} 
          onClick={onSelectUniversity} 
        />
      ))}
    </div>
  );
};

export default UniversityList; 