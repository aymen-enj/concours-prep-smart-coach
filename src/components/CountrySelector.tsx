import { Card, CardContent } from "@/components/ui/card";
import { Country, countries } from "@/models/concours";
import { Globe, ChevronRight, MapPin, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CountrySelectorProps {
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
}

const CountrySelector = ({ selectedCountry, onSelectCountry }: CountrySelectorProps) => {
  // Country-specific data for enhancing the UI
  const countryData = {
    'Maroc': {
      code: 'MA',
      stats: {
        universities: 18,
        students: '250K+',
        exams: 120
      },
      description: 'Préparez-vous pour les concours des meilleures écoles marocaines avec notre programme complet et adapté au système éducatif marocain.',
      flagUrl: 'https://flagcdn.com/ma.svg'
    },
    'France': {
      code: 'FR',
      stats: {
        universities: 45,
        students: '1.5M+',
        exams: 280
      },
      description: 'Accédez aux préparations pour les grandes écoles françaises et démarquez-vous dans les concours les plus compétitifs en France.',
      flagUrl: 'https://flagcdn.com/fr.svg'
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-3">Choisissez votre pays</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sélectionnez le pays où vous souhaitez passer vos concours pour accéder 
          aux préparations et examens adaptés à votre système éducatif.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {countries.map((country) => {
          const data = countryData[country];
          
          return (
            <Card 
              key={country}
              className={`
                cursor-pointer transition-all duration-300 overflow-hidden group relative h-full
                hover:shadow-xl hover:border-primary/50 hover:translate-y-[-5px]
                ${selectedCountry === country ? 'border-primary shadow-md' : 'border-border/40'}
              `}
              onClick={() => onSelectCountry(country)}
            >
              <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div 
                className={`
                  h-2.5 transition-all duration-300 group-hover:h-4
                  bg-gradient-to-r ${country === 'Maroc' ? 'from-red-600 to-green-600' : 'from-blue-600 via-white to-red-600'}
                `}
              ></div>
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  {/* Flag hero section */}
                  <div 
                    className="h-32 w-full bg-cover bg-center border-b border-border/30"
                    style={{ 
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.05)), url(${data.flagUrl})` 
                    }}
                  >
                    <div className="flex justify-between items-start h-full p-4">
                      <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-none">
                        {data.code}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          {data.stats.students}
                        </Badge>
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-foreground">
                          <Award className="h-3 w-3 mr-1" />
                          {data.stats.exams} examens
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Country info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">{country}</h3>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        <MapPin className="h-3 w-3 mr-1" />
                        {data.stats.universities} universités
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {data.description}
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary hover:bg-primary/10 gap-1 group-hover:bg-primary/10 transition-colors duration-300"
                      >
                        Explorer
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CountrySelector;