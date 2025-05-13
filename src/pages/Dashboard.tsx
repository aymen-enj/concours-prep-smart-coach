import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConcoursCard from "@/components/ConcoursCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Book, Calendar, GraduationCap, BookmarkPlus, Filter, CheckCircle, BarChart, TrendingUp, TrendingDown, Award, Clock, Bookmark, BookOpen, Trophy, Bell, Flame, ChevronRight, Sparkles, Brain, Zap, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

// Recent activity data
const recentActivity = [
  {
    id: 1,
    action: "Concours terminé",
    details: "Mathématiques - CNC 2022",
    date: "Aujourd'hui, 14:30",
    score: "85%",
    icon: CheckCircle,
    iconBg: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    id: 2,
    action: "Nouvelle correction disponible",
    details: "Physique - CPGE 2023",
    date: "Hier, 18:05",
    icon: Zap,
    iconBg: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  {
    id: 3,
    action: "Exercice pratiqué",
    details: "Algèbre linéaire - Niveau avancé",
    date: "06 mai, 09:15",
    score: "72%",
    icon: Brain,
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400"
  }
];

// Performance stats
const performanceStats = [
  { 
    label: "Mathématiques", 
    value: 85, 
    change: 5,
    color: "bg-primary" 
  },
  { 
    label: "Physique", 
    value: 72, 
    change: -2,
    color: "bg-purple-500" 
  },
  { 
    label: "Chimie", 
    value: 68, 
    change: 8, 
    color: "bg-green-500" 
  },
  { 
    label: "Français", 
    value: 75, 
    change: 0,
    color: "bg-amber-500" 
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Get unique values for filters
  const subjects = [...new Set(mockConcours.map((c) => c.subject))];
  const years = [...new Set(mockConcours.map((c) => c.year))];
  const levels = [...new Set(mockConcours.map((c) => c.level))];

  // Filter concours based on search term and filters
  const filteredConcours = mockConcours.filter((concours) => {
    const matchesSearch =
      concours.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concours.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" ? true : concours.subject === subjectFilter;
    const matchesYear = yearFilter === "all" ? true : concours.year.toString() === yearFilter;
    const matchesLevel = levelFilter === "all" ? true : concours.level === levelFilter;

    return matchesSearch && matchesSubject && matchesYear && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-1/4 h-64 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          {/* Dashboard header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-3xl font-poppins font-bold text-foreground">
                    Tableau de bord
              </h1>
                </div>
                <p className="text-muted-foreground">
                  Bienvenue ! Suivez votre progression et explorez nos concours
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
                <Button className="gap-2 rounded-full">
                  <BookmarkPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Mes concours</span>
                </Button>
              </div>
            </div>

            {/* Streak banner */}
            <div className="bg-gradient-to-r from-primary/80 to-blue-600 rounded-2xl p-5 text-white shadow-lg mb-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Flame className="h-7 w-7 text-amber-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">Streak de 7 jours ! 🔥</h3>
                  <p className="text-white/80 text-sm">Continuez votre série ! Vous êtes sur la bonne voie pour atteindre vos objectifs.</p>
                </div>
                <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">
                  Continuer
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Stats cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Concours complétés</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+2</span>
                      <span className="ml-1">ce mois</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Score moyen</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BarChart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">72%</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+5%</span>
                      <span className="ml-1">vs dernier</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Heures d'étude</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">12h</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <TrendingDown className="h-4 w-4 mr-1 text-amber-500" />
                      <span className="text-amber-500 font-medium">-2h</span>
                      <span className="ml-1">vs semaine</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Taux de réussite</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">78%</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 px-2 py-0.5 rounded-full">CNC</span>
                      <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-2 py-0.5 rounded-full">ENCG</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance graph */}
              <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all bg-background/70 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Performance par matière</h3>
                    </div>
                    <Select defaultValue="month">
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Semaine</SelectItem>
                        <SelectItem value="month">Mois</SelectItem>
                        <SelectItem value="year">Année</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    {performanceStats.map((stat, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stat.label}</span>
                            {stat.change > 0 && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-none">+{stat.change}%</Badge>}
                            {stat.change < 0 && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-none">{stat.change}%</Badge>}
                          </div>
                          <span className="text-sm font-semibold">{stat.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${stat.color} rounded-full`}
                            style={{ width: `${stat.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity feed */}
            <div className="lg:col-span-1">
              <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full bg-background/70 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Activité récente</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      Voir tout
                    </Button>
                  </div>
                  
                  <div className="space-y-5">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex-shrink-0 flex items-center justify-center`}>
                          <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                        </div>
                        <div className="flex-1 border-b border-border/30 pb-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{activity.action}</h4>
                              <p className="text-xs text-muted-foreground">{activity.details}</p>
                            </div>
                            {activity.score && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-200">
                                {activity.score}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 text-sm rounded-lg">
                    Charger plus
              </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Concours catalog section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-poppins font-bold text-foreground">
                Catalogue des concours
              </h2>
          </div>

          {/* Search and filters */}
            <Card className="border border-border/40 shadow-sm mb-8 bg-background/70 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Filtres</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
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

              <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Niveau</span>
                    </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="bg-background border border-input hover:bg-accent/10">
                        <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Concours tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-muted/50 p-1 rounded-lg mb-6">
                <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="popular" className="rounded-md data-[state=active]:bg-background">
                  Populaires
                </TabsTrigger>
                <TabsTrigger value="recent" className="rounded-md data-[state=active]:bg-background">
                  Récents
                </TabsTrigger>
                <TabsTrigger value="saved" className="rounded-md data-[state=active]:bg-background">
                  Sauvegardés
                </TabsTrigger>
            </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredConcours.map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
                </div>
            </TabsContent>
              
              <TabsContent value="popular" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredConcours.slice(0, 3).map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
              </div>
            </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredConcours.slice(2, 5).map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
              </div>
            </TabsContent>
              
              <TabsContent value="saved" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredConcours.filter(c => c.hasAccess).slice(0, 3).map((concours) => (
                    <ConcoursCard key={concours.id} {...concours} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

            {/* Show more button */}
            <div className="text-center">
              <Button variant="outline" className="gap-1 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30">
                Voir plus de concours
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Suggested concours */}
          <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-poppins font-bold text-foreground">
                Recommandé pour vous
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredConcours.slice(0, 3).map((concours) => (
                <Card key={concours.id} className="bg-background/80 backdrop-blur-sm border-white/10 hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-3 bg-gradient-to-r from-primary to-blue-600"></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{concours.title}</h3>
                          <p className="text-sm text-muted-foreground">{concours.subject}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                            {concours.year}
                          </Badge>
                          <Badge variant="outline" className="bg-background/50 border-border/50">
                            {concours.level}
                          </Badge>
                        </div>
                        <Button size="sm" className="h-8 text-xs">
                          Commencer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
