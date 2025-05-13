
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import Chatbot from "@/components/Chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, HelpCircle, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const Support = () => {
  const location = useLocation();
  const defaultTab = location.state?.defaultTab || "faq";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [animateContent, setAnimateContent] = useState(false);
  
  // Animation effect when switching tabs
  useEffect(() => {
    setAnimateContent(false);
    const timer = setTimeout(() => setAnimateContent(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.", {
      duration: 5000,
    });
    // Reset form fields
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-primary/10 p-2 mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-poppins font-bold text-dark-gray mb-4 dark:text-white">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Consultez notre base de connaissances, discutez avec notre assistant ou contactez-nous directement.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-2 shadow-sm mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq" className="py-3">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="py-3">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chatbot
                </TabsTrigger>
                <TabsTrigger value="contact" className="py-3">
                  <Mail className="mr-2 h-4 w-4" />
                  Nous contacter
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent 
              value="faq" 
              className={cn(
                "mt-6 transition-all duration-300 transform bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6",
                animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Faq />
            </TabsContent>
            
            <TabsContent 
              value="chatbot" 
              className={cn(
                "mt-6 transition-all duration-300 transform bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden",
                animateContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Assistant virtuel
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posez vos questions à notre assistant et obtenez des réponses instantanées.
                </p>
              </div>
              <div className="p-6">
                <Chatbot />
              </div>
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
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 hover-lift">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 h-12 w-12 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Notre équipe vous répondra sous 24 heures ouvrables.
                    </p>
                    <a href="mailto:support@concoursprep.com" className="text-primary font-medium hover:underline">
                      support@concoursprep.com
                    </a>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 hover-lift">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 h-12 w-12 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Disponible du lundi au vendredi, de 9h à 18h.
                    </p>
                    <a href="tel:+2125XXXXXXX" className="text-primary font-medium hover:underline">
                      +212 5XX-XXXXXX
                    </a>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Envoyez-nous un message</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Une question ou une suggestion ? N'hésitez pas à nous contacter directement.
                  </p>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Nom complet
                        </label>
                        <Input id="name" placeholder="Votre nom" required />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="votre@email.com" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Sujet
                      </label>
                      <Input id="subject" placeholder="Comment pouvons-nous vous aider ?" required />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Décrivez votre problème ou question..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Envoyer le message
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
