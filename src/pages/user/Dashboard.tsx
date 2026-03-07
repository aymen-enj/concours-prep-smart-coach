import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, BarChart as BarChartIcon, TrendingUp, TrendingDown, Clock, BookOpen, Trophy, Bell, Flame, ChevronRight, Sparkles, Brain, Zap, LineChart, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
// Recharts removed for performance block in favor of custom bars

// Mock data removed in favor of real data

const Dashboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("month");

  // Fetch real exam attempts
  const { data: attempts, isLoading } = useQuery({
    queryKey: ['dashboard-attempts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // Sort by creation date to mix all attempts chronologically
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (!attempts || attempts.length === 0) return null;

    // Consider an attempt completed if it has a completed_at date OR if it has a valid score/total_questions
    // This handles legacy data that might miss the completed_at timestamp
    const completedAttempts = attempts.filter(a => a.completed_at || (a.total_questions > 0));
    
    // 1. Total Completed
    const totalCompleted = completedAttempts.length;

    // 2. Average Score
    const totalScore = completedAttempts.reduce((acc, curr) => {
      // Avoid division by zero
      const percentage = curr.total_questions > 0 
        ? (curr.score / curr.total_questions) * 100 
        : 0;
      return acc + percentage;
    }, 0);
    const avgScore = totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0;

    // 3. Performance by Subject
    const subjectStats: Record<string, { total: number; count: number; percentages: { value: number; date: string }[] }> = {};
    let totalMinutes = 0;
    let successfulAttempts = 0;

    completedAttempts.forEach(att => {
      // Normalisation du nom de la matière (ex: "math" -> "Math", "general" -> "Général")
      let subjectRaw = att.subject || 'Général';
      // Première lettre majuscule, le reste en minuscule
      let subject = subjectRaw.charAt(0).toUpperCase() + subjectRaw.slice(1).toLowerCase();
      
      // Unification des variantes
      if (subject === 'General' || subject === 'Global') subject = 'Général';
      if (subject === 'Maths' || subject === 'Math') subject = 'Mathématiques';
      if (subject === 'Pc' || subject === 'Physique-chimie') subject = 'Physique-Chimie';

      const percentage = att.total_questions > 0 
        ? (att.score / att.total_questions) * 100 
        : 0;
      
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, count: 0, percentages: [] };
      }
      subjectStats[subject].total += percentage;
      subjectStats[subject].count += 1;
      subjectStats[subject].percentages.push({
        value: percentage,
        date: (att.completed_at || att.created_at || new Date().toISOString()) as string
      });

      // Stats accumulation
      totalMinutes += att.duration_minutes || 0;
      if (percentage >= 50) successfulAttempts++;
    });

    const palette = [
      "#2F80ED", // Bleu vif
      "#94A3B8", // Gris bleuté
      "#22C55E", // Vert
      "#F59E0B"  // Orange
    ];

    const performanceStats = Object.entries(subjectStats).map(([label, data], index) => {
      const sorted = [...data.percentages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const last = sorted[0]?.value ?? 0;
      const previous = sorted[1]?.value ?? last;
      const change = Math.round(last - previous);

      return {
        label,
        value: Math.round(data.total / data.count),
        change,
        color: palette[index % palette.length]
      };
    });

    // 4. Streak Calculation
    const uniqueDays = Array.from(new Set(attempts.map(a => format(new Date(a.created_at), 'yyyy-MM-dd'))));
    
    let currentStreak = 0;
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    const hasToday = uniqueDays.includes(todayStr);
    const hasYesterday = uniqueDays.includes(yesterdayStr);

    if (hasToday || hasYesterday) {
      currentStreak = 1;
      let checkDate = new Date(hasToday ? today : yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      
      while (true) {
        const checkStr = format(checkDate, 'yyyy-MM-dd');
        if (uniqueDays.includes(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const successRate = totalCompleted > 0 ? Math.round((successfulAttempts / totalCompleted) * 100) : 0;
    const totalHours = Math.floor(totalMinutes / 60); // Use floor for full hours, or round

    // Recent unique exams
    const recentUniqueExamsMap = new Map();
    attempts.forEach(att => {
        // Use exam_name as key to dedup, or composite key
        const key = att.exam_name || att.id;
        if (!recentUniqueExamsMap.has(key)) {
            recentUniqueExamsMap.set(key, att);
        }
    });
    const recentExams = Array.from(recentUniqueExamsMap.values()).slice(0, 3);

    // Activity processing
    const processedActivity = attempts.slice(0, 8).map(a => {
        // Heuristic: It's completed if completed_at exists OR if we have a valid total_questions count (legacy data)
        const isCompleted = !!a.completed_at || (a.total_questions > 0);
        return {
            ...a,
            is_completed: isCompleted,
            display_date: a.completed_at || a.created_at,
            score_percentage: (a.total_questions > 0) ? Math.round((a.score / a.total_questions) * 100) : 0
        };
    });

    return {
      totalCompleted,
      avgScore,
      performanceStats,
      recentActivity: processedActivity,
      totalHours,
      successRate,
      recentExams,
      streakDays: currentStreak,
      hasStudiedToday: hasToday
    };
  }, [attempts]);
  
  // Prepare display data (use real stats or fallback to empty state)
  const displayPerformance = stats?.performanceStats || [];
  const displayActivity = stats?.recentActivity || [];
  const displayRecentExams = stats?.recentExams || [];
  const streak = stats?.streakDays || 0;
  const hasStudiedToday = stats?.hasStudiedToday || false;


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-1/4 h-64 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          {/* Dashboard header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                    <BarChartIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-poppins font-bold text-foreground tracking-tight">
                      Bonjour, {user?.user_metadata?.full_name?.split(' ')[0] || 'Docteur'} ! 👋
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Voici le résumé de vos progrès pour cette session.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 h-10">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
                <Button className="gap-2 rounded-full h-10 shadow-md shadow-primary/20" asChild>
                  <Link to="/concours">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Explorer les concours</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Streak banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/10 mb-8 relative overflow-hidden border border-white/10">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${streak > 0 ? "bg-white/20" : "bg-white/10"} rounded-full flex items-center justify-center backdrop-blur-sm`}>
                  <Flame className={`h-7 w-7 ${streak > 0 ? "text-amber-300 fill-amber-300" : "text-gray-300"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">
                    {streak > 0 ? `Série de ${streak} jour${streak > 1 ? 's' : ''} ! 🔥` : "Aucune série active 🧊"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {streak > 0 
                      ? hasStudiedToday 
                        ? "Super travail aujourd'hui ! Continuez demain." 
                        : "Complétez un quiz aujourd'hui pour garder votre série !"
                      : "Commencez une série dès aujourd'hui en passant un quiz !"}
                  </p>
                </div>
                <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm" asChild>
                  <Link to="/concours">
                    {streak > 0 && hasStudiedToday ? "Continuer" : "Commencer"}
                  </Link>
                </Button>
              </div>
            </div>
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
                    <p className="text-2xl font-bold">{stats?.totalCompleted || 0}</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <span className="text-muted-foreground font-medium">--</span>
                      <span className="ml-1">ce mois</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Score moyen</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <BarChartIcon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stats?.avgScore || 0}%</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <span className="text-muted-foreground font-medium">--</span>
                      <span className="ml-1">vs dernier</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Temps d'étude</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalHours || 0}h</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <span className="text-muted-foreground font-medium">--</span>
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
                    <p className="text-2xl font-bold">{stats?.successRate || 0}%</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                       <span className="text-xs text-muted-foreground">Score &ge; 50%</span>
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
                  
                  <div className="w-full">
                    {displayPerformance.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-[260px] text-center">
                         <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                           <BarChartIcon className="h-8 w-8 text-primary" />
                         </div>
                         <h4 className="font-medium text-lg mb-2">Aucune donnée pour le moment</h4>
                         <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                           Terminez votre premier concours pour débloquer vos statistiques détaillées.
                         </p>
                         <Button asChild size="sm" className="rounded-full shadow-md shadow-primary/20">
                           <Link to="/concours">Commencer un concours</Link>
                         </Button>
                       </div>
                    ) : (
                      <div className="space-y-6">
                        {displayPerformance.map((entry) => {
                          const changeColor = entry.change > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : entry.change < 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700";

                          const barWidth = Math.max(0, Math.min(entry.value, 100));

                          return (
                            <div key={entry.label} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground">{entry.label}</span>
                                  <Badge className={`${changeColor} border-0 text-[12px] font-semibold px-2 py-0.5 rounded-full`}>
                                    {entry.change > 0 ? `+${entry.change}%` : `${entry.change}%`}
                                  </Badge>
                                </div>
                                <span className="text-sm font-semibold text-foreground">{entry.value}%</span>
                              </div>
                              <div className="h-3 rounded-full bg-muted flex items-center">
                                <div
                                  className="h-3 rounded-full transition-all"
                                  style={{ width: `${barWidth}%`, backgroundColor: entry.color }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity feed */}
            <div className="lg:col-span-1">
              <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full bg-background/70 backdrop-blur-sm max-h-[500px] flex flex-col">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Activité récente</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      Voir tout
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-2 flex-1 overflow-y-auto"> 
                  <div className="space-y-1">
                    {displayActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20 m-2">
                          <Sparkles className="h-8 w-8 text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground font-medium mb-1">C'est calme par ici...</p>
                          <p className="text-xs text-muted-foreground/80 mb-3">Prêt à relever un défi ?</p>
                          <Button asChild variant="outline" size="sm" className="h-8">
                            <Link to="/concours">Explorer</Link>
                          </Button>
                        </div>
                    ) : (
                      displayActivity.map((activity, idx) => (
                      <div key={activity.id || idx} className="flex gap-3 relative group pb-4">
                        {/* Connecting line */}
                        {idx !== displayActivity.length - 1 && (
                            <div className="absolute left-[19px] top-10 bottom-0 w-[1px] bg-border/40 group-hover:bg-primary/20 transition-colors"></div>
                        )}

                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm z-10 ${activity.is_completed ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                          {activity.is_completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div className="pr-2">
                              <h4 className="text-sm font-medium line-clamp-1 text-foreground/90">{activity.is_completed ? 'Concours terminé' : 'En cours'}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 font-medium" title={activity.exam_name}>
                                {activity.exam_name || activity.subject || 'Examen sans titre'}
                              </p>
                            </div>
                            {activity.is_completed && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
                                    {activity.total_questions > 0 
                                      ? Math.round((activity.score / activity.total_questions) * 100) 
                                      : 0}%
                                </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
                                <Calendar className="h-3 w-3" />
                                {activity.display_date 
                                    ? format(new Date(activity.display_date), "d MMM, HH:mm", { locale: fr })
                                    : 'Date inconnue'}
                             </div>
                             {activity.subject && (
                               <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-md border border-border/50">
                                 {activity.subject.substring(0, 15)}
                               </span>
                             )}
                          </div>
                        </div>
                      </div>
                    )))}
                  </div>
                  
                  {displayActivity.length > 0 && (
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground hover:text-primary">
                      Voir plus d'activité <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
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
                  Concours récemment consultés
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
              {displayRecentExams.length === 0 ? (
                 <div className="col-span-full text-center py-6 text-muted-foreground/80 font-medium">
                   Aucun concours consulté récemment
                 </div>
              ) : (
                displayRecentExams.map((exam, i) => (
                <Card key={i} className="bg-background/80 backdrop-blur-sm border-white/10 hover:shadow-md transition-all overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-3 bg-gradient-to-r from-primary to-blue-600"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium line-clamp-1">{exam.exam_name || 'Concours'}</h3>
                        <p className="text-sm text-muted-foreground">{exam.subject || 'Général'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          {exam.created_at ? new Date(exam.created_at).getFullYear() : 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="bg-background/50 border-border/50">
                          {exam.exam_type || 'Examen'}
                        </Badge>
                      </div>
                      <Button size="sm" className="h-8 text-xs" asChild>
                         <Link to={exam.exam_id ? `/exam/${exam.exam_id}` : '/concours'}>Reprendre</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
