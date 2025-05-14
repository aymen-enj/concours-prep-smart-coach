import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConcoursCard from "@/components/ConcoursCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Book, Calendar, Filter, ArrowLeft, GraduationCap, MapPin, School, BookOpen, Building, CheckCircle, Trophy, Star, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CountrySelector from "@/components/CountrySelector";
import EducationLevelSelector from "@/components/EducationLevelSelector";
import UniversityList from "@/components/UniversityList";
import { Country, EducationLevel, getUniversitiesByCountry, getConcoursByUniversity } from "@/models/concours";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Testimonials data for the marketing section
const testimonials = [
  {
    name: "Sarah L.",
    role: "Étudiante en Prépa",
    text: "Grâce à cette plateforme, j'ai pu intégrer l'école de mes rêves. Les examens sont parfaitement adaptés au niveau réel des concours.",
    university: "École Polytechnique",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Thomas M.",
    role: "Étudiant en Médecine",
    text: "La préparation aux concours n'a jamais été aussi efficace. Les corrections détaillées m'ont permis de progresser rapidement.",
    university: "Faculté de Médecine Paris",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];

// Key features for marketing section
const keyFeatures = [
  {
    icon: CheckCircle,
    title: "Contenus officiels",
    description: "Annales et exercices conformes aux programmes officiels"
  },
  {
    icon: Trophy,
    title: "Succès garanti",
    description: "93% de réussite parmi nos utilisateurs premium"
  },
  {
    icon: Star,
    title: "Corrections détaillées",
    description: "Explications pas à pas et conseils personnalisés"
  }
];

const ConcoursPage = () => {
  // Hierarchical navigation state
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
  
  // Filter and search state (used only in concours view)
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  
  // Step handlers
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setSelectedLevel(null);
    setSelectedUniversityId(null);
  };
  
  const handleSelectLevel = (level: EducationLevel) => {
    setSelectedLevel(level);
    setSelectedUniversityId(null);
  };
  
  const handleSelectUniversity = (universityId: string) => {
    setSelectedUniversityId(universityId);
  };
  
  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setSelectedLevel(null);
    setSelectedUniversityId(null);
  };
  
  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setSelectedUniversityId(null);
  };
  
  const handleBackToUniversities = () => {
    setSelectedUniversityId(null);
  };

  // Get universities for selected country and level
  const universities = selectedCountry ? getUniversitiesByCountry(selectedCountry) : [];
  
  // Get concours for selected university
  const concoursByUniversity = selectedUniversityId ? getConcoursByUniversity(selectedUniversityId) : [];
  
  // Filter concours based on search and filters
  const filteredConcours = concoursByUniversity.filter((concours) => {
    const matchesSearch =
      concours.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concours.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" ? true : concours.subject === subjectFilter;
    const matchesYear = yearFilter === "all" ? true : concours.year.toString() === yearFilter;

    return matchesSearch && matchesSubject && matchesYear;
  });

  // Get unique values for filters
  const subjects = [...new Set(concoursByUniversity.map((c) => c.subject))];
  const years = [...new Set(concoursByUniversity.map((c) => c.year))];

  // Get current step for breadcrumb and animations
  const getCurrentStep = () => {
    if (selectedUniversityId) return 3;
    if (selectedLevel) return 2;
    if (selectedCountry) return 1;
    return 0;
  };

  const currentStep = getCurrentStep();

  // Render the header title based on current navigation step
  const renderNavigationHeader = () => {
    if (selectedUniversityId) {
      const university = universities.find(u => u.id === selectedUniversityId);
      return (
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full hover:bg-primary/10" 
            onClick={handleBackToUniversities}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-poppins font-bold text-foreground">
                {university?.name}
              </h2>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{university?.location}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (selectedLevel) {
      return (
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full hover:bg-primary/10" 
            onClick={handleBackToLevels}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <School className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-poppins font-bold text-foreground">
                {selectedLevel}
              </h2>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{selectedCountry}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (selectedCountry) {
      return (
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full hover:bg-primary/10" 
            onClick={handleBackToCountries}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-muted">
              {selectedCountry === 'Maroc' ? (
                <img 
                  src="https://flagcdn.com/ma.svg" 
                  alt="Drapeau du Maroc" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src="https://flagcdn.com/fr.svg" 
                  alt="Drapeau de la France" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h2 className="text-2xl font-poppins font-bold text-foreground">
              {selectedCountry}
            </h2>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-poppins font-bold text-foreground">
          Explorer les concours
        </h2>
      </div>
    );
  };

  // Render breadcrumb navigation
  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-auto px-2 py-1 font-normal hover:bg-primary/5 text-foreground"
          onClick={handleBackToCountries}
        >
          Pays
        </Button>
        
        {currentStep >= 1 && (
          <>
            <ArrowLeft className="h-3 w-3 rotate-180" />
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-auto px-2 py-1 font-normal hover:bg-primary/5 ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}
              onClick={handleBackToLevels}
              disabled={currentStep < 1}
            >
              Niveau
            </Button>
          </>
        )}
        
        {currentStep >= 2 && (
          <>
            <ArrowLeft className="h-3 w-3 rotate-180" />
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-auto px-2 py-1 font-normal hover:bg-primary/5 ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}
              onClick={handleBackToUniversities}
              disabled={currentStep < 2}
            >
              Université
            </Button>
          </>
        )}
        
        {currentStep >= 3 && (
          <>
            <ArrowLeft className="h-3 w-3 rotate-180" />
            <span className="px-2 py-1 text-primary font-medium">
              Concours
            </span>
          </>
        )}
      </div>
    );
  };

  // Marketing section for the main page
  const renderMarketingSection = () => {
    if (currentStep !== 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <Card className="overflow-hidden border-border/30 backdrop-blur-sm bg-gradient-to-br from-background to-background/70">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span>L'excellence académique accessible à tous</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 font-poppins">Préparez-vous pour réussir <br/> vos concours</h2>
                <p className="text-muted-foreground mb-6">
                  Notre plateforme vous offre une préparation complète et adaptée aux examens des meilleures 
                  universités. Des milliers d'étudiants ont déjà réussi grâce à notre méthode.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-background/80 border border-border/30">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button className="rounded-full gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-primary">
                    <Trophy className="h-4 w-4" />
                    Débloquer l'accès Premium
                  </Button>
                  <Button variant="outline" className="rounded-full gap-2 border-primary/30 hover:bg-primary/5">
                    <BookOpen className="h-4 w-4" />
                    Découvrir nos offres
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Ils ont réussi grâce à nous
                </h3>
                
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-4 border-border/30 bg-background/80">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-border">
                          <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-medium">{testimonial.name}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                          </div>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                            {testimonial.university}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex -space-x-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                        <img 
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`} 
                          alt="User avatar" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">5000+</span> étudiants actifs
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-96 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-1/4 h-80 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        <div className="absolute top-1/4 left-1/2 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-poppins font-bold text-foreground">
                    Catalogue des concours
                  </h1>
                  <div className="flex items-center text-muted-foreground text-sm gap-3 mt-1">
                    <div className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                      <span>+400 concours</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                      <span>Mise à jour régulière</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                      <span>Corrections détaillées</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Badge variant="outline" className="gap-1 px-2 py-1 border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  Accès illimité avec Premium
                </Badge>
                <Button 
                  className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-600 shadow-sm"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Devenir Premium
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Marketing Section */}
          {renderMarketingSection()}

          {/* Breadcrumb navigation */}
          {currentStep > 0 && renderBreadcrumb()}

          {/* Navigation Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-background via-primary/5 to-background rounded-2xl p-8 mb-8 border border-border/30 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              {renderNavigationHeader()}
            </div>

            {/* Navigation Content - Shows different content based on selection state */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              {/* Step 1: Country Selection */}
              {!selectedCountry && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CountrySelector 
                    selectedCountry={selectedCountry} 
                    onSelectCountry={handleSelectCountry} 
                  />
                </motion.div>
              )}

              {/* Step 2: Education Level Selection */}
              {selectedCountry && !selectedLevel && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <EducationLevelSelector 
                    selectedLevel={selectedLevel} 
                    onSelectLevel={handleSelectLevel} 
                  />
                </motion.div>
              )}

              {/* Step 3: University Selection */}
              {selectedCountry && selectedLevel && !selectedUniversityId && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <UniversityList 
                    universities={universities.filter(univ => 
                      // Only show universities that have concours matching the selected level
                      getConcoursByUniversity(univ.id).some(
                        concours => concours.educationLevel === selectedLevel
                      )
                    )} 
                    onSelectUniversity={handleSelectUniversity} 
                  />
                </motion.div>
              )}

              {/* Step 4: Concours List */}
              {selectedUniversityId && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Filter controls for concours */}
                  <Card className="border border-border/40 shadow-md mb-8 bg-background/80 backdrop-blur-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">Filtrer les concours</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="Rechercher un concours..."
                              className="pl-10 border border-input bg-background hover:bg-accent/10 focus-visible:ring-1"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Book className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Matière</span>
                          </div>
                          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                            <SelectTrigger className="bg-background border border-input hover:bg-accent/10">
                              <SelectValue placeholder="Toutes les matières" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les matières</SelectItem>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Année</span>
                          </div>
                          <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="bg-background border border-input hover:bg-accent/10">
                              <SelectValue placeholder="Toutes les années" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les années</SelectItem>
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Display concours list */}
                  {filteredConcours.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">
                            {filteredConcours.length} concours disponibles
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
                            <Star className="h-3.5 w-3.5 mr-1 fill-amber-500 text-amber-500" />
                            Recommandé
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredConcours.map((concours, index) => (
                          <motion.div 
                            key={concours.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <ConcoursCard 
                              id={concours.id}
                              title={concours.title}
                              subject={concours.subject}
                              year={concours.year}
                              level={concours.educationLevel}
                              isPaid={concours.isPaid}
                              hasAccess={concours.hasAccess}
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-10 text-center">
                        <div className="max-w-xl mx-auto">
                          <h3 className="text-xl font-medium mb-3">Vous ne trouvez pas ce que vous cherchez ?</h3>
                          <p className="text-muted-foreground mb-6">
                            Nos formules Premium vous donnent accès à plus de 300 concours supplémentaires
                            avec des corrections détaillées et un suivi personnalisé.
                          </p>
                          <Button 
                            className="gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-primary"
                          >
                            <Sparkles className="h-4 w-4" />
                            Découvrir l'offre Premium
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16 bg-background/50 backdrop-blur-sm rounded-xl border border-border/30">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Book className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-3">Aucun concours trouvé</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Aucun concours ne correspond à vos critères de recherche. 
                        Essayez de modifier vos filtres ou de chercher un autre terme.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          variant="outline" 
                          className="gap-2 rounded-full border-primary/30 hover:bg-primary/5" 
                          onClick={handleBackToUniversities}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Revenir aux universités
                        </Button>
                        <Button className="gap-2 rounded-full">
                          <Sparkles className="h-4 w-4" />
                          Voir nos concours premium
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConcoursPage;
