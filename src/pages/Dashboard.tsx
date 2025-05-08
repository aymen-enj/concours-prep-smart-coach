
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConcoursCard from "@/components/ConcoursCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Sample data for concours
const mockConcours = [
  {
    id: "1",
    title: "Concours CNC",
    subject: "Mathématiques",
    year: 2023,
    level: "Préparatoire",
    isPaid: false,
    hasAccess: true,
  },
  {
    id: "2",
    title: "Concours Médecine",
    subject: "Biologie",
    year: 2023,
    level: "Terminale",
    isPaid: true,
    hasAccess: true,
  },
  {
    id: "3",
    title: "Concours ENCG",
    subject: "Économie",
    year: 2022,
    level: "Bac+2",
    isPaid: true,
    hasAccess: false,
  },
  {
    id: "4",
    title: "Concours ENA",
    subject: "Droit Administratif",
    year: 2023,
    level: "Bac+3",
    isPaid: true,
    hasAccess: false,
  },
  {
    id: "5",
    title: "Concours ENSAM",
    subject: "Physique",
    year: 2022,
    level: "Préparatoire",
    isPaid: false,
    hasAccess: true,
  },
  {
    id: "6",
    title: "Concours ISCAE",
    subject: "Mathématiques",
    year: 2021,
    level: "Bac+2",
    isPaid: true,
    hasAccess: true,
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  // Get unique values for filters
  const subjects = [...new Set(mockConcours.map((c) => c.subject))];
  const years = [...new Set(mockConcours.map((c) => c.year))];
  const levels = [...new Set(mockConcours.map((c) => c.level))];

  // Filter concours based on search term and filters
  const filteredConcours = mockConcours.filter((concours) => {
    const matchesSearch =
      concours.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concours.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter ? concours.subject === subjectFilter : true;
    const matchesYear = yearFilter ? concours.year.toString() === yearFilter : true;
    const matchesLevel = levelFilter ? concours.level === levelFilter : true;

    return matchesSearch && matchesSubject && matchesYear && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-dark-gray mb-2">
                Catalogue des concours
              </h1>
              <p className="text-gray-600">
                Explorez et préparez-vous pour les concours disponibles
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-royal-blue hover:bg-blue-700">
                Mes concours sauvegardés
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher un concours..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les matières</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les années</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les niveaux</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabs for different categories */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Tous les concours</TabsTrigger>
              <TabsTrigger value="recent">Récents</TabsTrigger>
              <TabsTrigger value="popular">Populaires</TabsTrigger>
              <TabsTrigger value="free">Gratuits</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-6">
              {filteredConcours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConcours.map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun concours ne correspond à votre recherche.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="recent" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConcours
                  .filter((c) => c.year >= 2022)
                  .map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="popular" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConcours
                  .slice(0, 3) // Simulating popular concours
                  .map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="free" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConcours
                  .filter((c) => !c.isPaid)
                  .map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
