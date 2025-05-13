import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import Chatbot from "@/components/Chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, HelpCircle, Mail, Phone, Send, Search, MapPin, BookOpen, Clock, Users, Zap, Sparkles, Shield, Info, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Support = () => {
  const location = useLocation();
  const defaultTab = location.state?.defaultTab || "faq";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [animateContent, setAnimateContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Animation effect when switching tabs
  useEffect(() => {
    setAnimateContent(false);
    const timer = setTimeout(() => setAnimateContent(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
      duration: 5000,
    });
    // Reset form fields
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  // Common questions for quick access
  const commonQuestions = [
    { text: "Comment fonctionne la correction IA ?", icon: <Zap className="h-3.5 w-3.5" /> },
    { text: "Comment annuler mon abonnement ?", icon: <Info className="h-3.5 w-3.5" /> },
    { text: "Puis-je essayer gratuitement ?", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { text: "Comment contacter le support ?", icon: <Mail className="h-3.5 w-3.5" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-1/4 h-64 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-poppins font-bold text-foreground">
                Centre d'aide
              </h1>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trouvez rapidement des réponses à vos questions ou contactez notre équipe de support
            </p>
          </div>

          {/* Search section */}
          <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg mb-8 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xl mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher une question..." 
                      className="pl-10 py-6 text-base border-border/60 bg-background/50 focus-visible:ring-primary/30"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-sm rounded-full flex items-center gap-2 transition-colors border border-primary/10"
                      onClick={() => setActiveTab("faq")}
                    >
                      <span className="p-1.5 rounded-full bg-primary/10 text-primary">
                        {question.icon}
                      </span>
                      {question.text}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg mb-8 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
            <CardContent className="p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1.5 rounded-xl">
                  <TabsTrigger 
                    value="faq" 
                    className="py-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    FAQ
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chatbot" 
                    className="py-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chatbot
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contact" 
                    className="py-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Nous contacter
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent 
                  value="faq" 
                  className={cn(
                    "mt-6 transition-all duration-300 transform",
                    animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  <Faq />
                </TabsContent>
                
                <TabsContent 
                  value="chatbot" 
                  className={cn(
                    "mt-6 transition-all duration-300 transform",
                    animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        Assistant virtuel
                      </CardTitle>
                      <CardDescription>
                        Posez vos questions à notre assistant et obtenez des réponses instantanées.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Chatbot />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent 
                  value="contact" 
                  className={cn(
                    "mt-6 transition-all duration-300 transform",
                    animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                      <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm overflow-hidden">
                        <div className="h-1 bg-blue-500"></div>
                        <CardContent className="p-6">
                          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 h-12 w-12 flex items-center justify-center mb-4">
                            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Email</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Notre équipe vous répondra sous 24 heures ouvrables.
                          </p>
                          <a href="mailto:support@concoursprep.com" className="text-primary font-medium hover:underline flex items-center gap-2">
                            support@concoursprep.com
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/50">
                              <Clock className="h-3 w-3 mr-1" /> 24h
                            </Badge>
                          </a>
                        </CardContent>
                      </Card>

                      <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm overflow-hidden">
                        <div className="h-1 bg-green-500"></div>
                        <CardContent className="p-6">
                          <div className="rounded-full bg-green-100 dark:bg-green-900/30 h-12 w-12 flex items-center justify-center mb-4">
                            <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Disponible du lundi au vendredi, de 9h à 18h.
                          </p>
                          <a href="tel:+2125XXXXXXX" className="text-primary font-medium hover:underline flex items-center gap-2">
                            +212 5XX-XXXXXX
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50">
                              9h-18h
                            </Badge>
                          </a>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="md:col-span-2">
                      <Card className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm overflow-hidden h-full">
                        <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
                        <CardContent className="p-6">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                              <Send className="h-4 w-4" />
                            </div>
                            Envoyez-nous un message
                          </h2>
                          <p className="text-muted-foreground mb-6">
                            Une question ou une suggestion ? N'hésitez pas à nous contacter directement.
                          </p>
                          <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                                  Nom complet
                                </label>
                                <Input 
                                  id="name" 
                                  placeholder="Votre nom" 
                                  required 
                                  className="bg-background/50 border-border/60 focus-visible:ring-primary/30"
                                />
                              </div>
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  Email
                                </label>
                                <Input 
                                  id="email" 
                                  type="email" 
                                  placeholder="votre@email.com" 
                                  required 
                                  className="bg-background/50 border-border/60 focus-visible:ring-primary/30"
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="subject" className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                Sujet
                              </label>
                              <Input 
                                id="subject" 
                                placeholder="Comment pouvons-nous vous aider ?" 
                                required 
                                className="bg-background/50 border-border/60 focus-visible:ring-primary/30"
                              />
                            </div>
                            <div>
                              <label htmlFor="message" className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                Message
                              </label>
                              <Textarea 
                                id="message" 
                                placeholder="Décrivez votre problème ou question..."
                                rows={5}
                                required
                                className="bg-background/50 border-border/60 focus-visible:ring-primary/30"
                              />
                            </div>
                            <Button 
                              type="submit" 
                              className="flex items-center gap-2 rounded-full"
                            >
                              <Send className="h-4 w-4" />
                              Envoyer le message
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Support commitment section */}
          <div className="mt-12">
            <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl p-8 border border-primary/10 backdrop-blur-sm shadow-sm">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-poppins font-bold text-foreground">
                    Notre engagement
                  </h2>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Nous nous engageons à fournir un support de qualité à tous nos utilisateurs pour vous aider à réussir vos concours.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Clock className="h-6 w-6 text-primary" />,
                    title: "Réponse rapide",
                    description: "Notre équipe s'engage à vous répondre dans un délai de 24 heures maximum."
                  },
                  {
                    icon: <Users className="h-6 w-6 text-primary" />,
                    title: "Support personnalisé",
                    description: "Des experts dédiés pour répondre à vos questions spécifiques sur les concours."
                  },
                  {
                    icon: <Zap className="h-6 w-6 text-primary" />,
                    title: "Assistance technique",
                    description: "Un support technique réactif pour résoudre rapidement vos problèmes."
                  }
                ].map((item, index) => (
                  <Card key={index} className="border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all bg-background/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-primary/10 h-12 w-12 flex items-center justify-center mb-4">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
