
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, BarChart, TrendingUp, TrendingDown, Clock, BookOpen, Trophy, Bell, Flame, ChevronRight, Sparkles, Brain, Zap, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStatistics } from "@/hooks/useUserStatistics";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  const { statistics, loading, error } = useUserStatistics();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
            <p className="text-muted-foreground mb-6">Veuillez vous connecter pour accéder à vos statistiques.</p>
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de vos statistiques...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Erreur</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getSubjectColor = (index: number) => {
    const colors = ["bg-primary", "bg-purple-500", "bg-green-500", "bg-amber-500", "bg-red-500", "bg-blue-500"];
    return colors[index % colors.length];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return CheckCircle;
      case 'practice_session':
        return Brain;
      default:
        return Zap;
    }
  };

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
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <BarChart className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-poppins font-bold text-foreground">
                    Statistiques
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Suivez votre progression et visualisez vos performances
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
                <Button className="gap-2 rounded-full" asChild>
                  <Link to="/concours">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Explorer les concours</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Streak banner */}
            {statistics && statistics.totalAttempts > 0 && (
              <div className="bg-gradient-to-r from-primary/80 to-blue-600 rounded-2xl p-5 text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Flame className="h-7 w-7 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">
                      {statistics.totalAttempts} concours complétés ! 🎓
                    </h3>
                    <p className="text-white/80 text-sm">
                      Score moyen de {statistics.averageScore}% - Continuez votre excellent travail !
                    </p>
                  </div>
                  <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">
                    Continuer
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stats and Activity section */}
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
                    <p className="text-2xl font-bold">{statistics?.totalAttempts || 0}</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">Total</span>
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
                    <p className="text-2xl font-bold">{statistics?.averageScore || 0}%</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">Performance</span>
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
                    <p className="text-2xl font-bold">{statistics?.totalStudyTime || 0}h</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-blue-500 font-medium">Total</span>
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
                    <p className="text-2xl font-bold">{statistics?.successRate || 0}%</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 px-2 py-0.5 rounded-full">Réussite</span>
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
                    {statistics?.subjectPerformance.length ? (
                      statistics.subjectPerformance.map((stat, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{stat.subject}</span>
                              {stat.change > 0 && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-none">
                                  +{stat.change}%
                                </Badge>
                              )}
                              {stat.change < 0 && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-none">
                                  {stat.change}%
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm font-semibold">{stat.score}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getSubjectColor(i)} rounded-full`}
                              style={{ width: `${stat.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune donnée de performance disponible</p>
                        <p className="text-sm">Commencez un concours pour voir vos statistiques !</p>
                      </div>
                    )}
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
                    {statistics?.recentActivity.length ? (
                      statistics.recentActivity.map((activity) => {
                        const IconComponent = getActivityIcon(activity.type);
                        return (
                          <div key={activity.id} className="flex gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                              activity.type === 'exam_completed' 
                                ? "bg-green-100 dark:bg-green-900/20" 
                                : "bg-purple-100 dark:bg-purple-900/20"
                            )}>
                              <IconComponent className={cn(
                                "h-5 w-5",
                                activity.type === 'exam_completed'
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-purple-600 dark:text-purple-400"
                              )} />
                            </div>
                            <div className="flex-1 border-b border-border/30 pb-5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium">{activity.title}</h4>
                                  <p className="text-xs text-muted-foreground">{activity.subject}</p>
                                </div>
                                {activity.score && (
                                  <Badge className={cn(
                                    "hover:bg-green-200",
                                    activity.score >= 60 
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                                  )}>
                                    {activity.score}%
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune activité récente</p>
                        <p className="text-sm">Commencez un concours pour voir votre activité !</p>
                      </div>
                    )}
                  </div>
                  
                  {statistics?.recentActivity.length ? (
                    <Button variant="outline" className="w-full mt-4 text-sm rounded-lg">
                      Charger plus
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended concours */}
          <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-poppins font-bold text-foreground">
                  Concours recommandés
                </h2>
              </div>
              <Button variant="outline" className="gap-1" asChild>
                <Link to="/concours">
                  Voir tous les concours
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="bg-background/80 backdrop-blur-sm border-white/10 hover:shadow-md transition-all overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-3 bg-gradient-to-r from-primary to-blue-600"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">Concours ENSA</h3>
                        <p className="text-sm text-muted-foreground">Mathématiques & Physique</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          2024
                        </Badge>
                        <Badge variant="outline" className="bg-background/50 border-border/50">
                          Classes préparatoires
                        </Badge>
                      </div>
                      <Button size="sm" className="h-8 text-xs" asChild>
                        <Link to="/concours">Commencer</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background/80 backdrop-blur-sm border-white/10 hover:shadow-md transition-all overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-3 bg-gradient-to-r from-primary to-blue-600"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">Concours ENSAM</h3>
                        <p className="text-sm text-muted-foreground">Physique & Chimie</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          2022
                        </Badge>
                        <Badge variant="outline" className="bg-background/50 border-border/50">
                          Classes préparatoires
                        </Badge>
                      </div>
                      <Button size="sm" className="h-8 text-xs" asChild>
                        <Link to="/concours">Commencer</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background/80 backdrop-blur-sm border-white/10 hover:shadow-md transition-all overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-3 bg-gradient-to-r from-primary to-blue-600"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">Concours Médecine</h3>
                        <p className="text-sm text-muted-foreground">Sciences</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          2024
                        </Badge>
                        <Badge variant="outline" className="bg-background/50 border-border/50">
                          Bac
                        </Badge>
                      </div>
                      <Button size="sm" className="h-8 text-xs" asChild>
                        <Link to="/concours">Commencer</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
