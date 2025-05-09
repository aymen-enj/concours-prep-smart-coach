
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import Chatbot from "@/components/Chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, HelpCircle } from "lucide-react";

const Support = () => {
  const location = useLocation();
  const defaultTab = location.state?.defaultTab || "faq";

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-light-gray dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-poppins font-bold text-dark-gray mb-4 dark:text-white">
              Centre de Support
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
              Besoin d'aide ? Consultez notre FAQ ou discutez directement avec notre assistant via le chatbot.
            </p>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="faq">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="chatbot">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chatbot
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="mt-6">
              <Faq />
            </TabsContent>
            
            <TabsContent value="chatbot" className="mt-6">
              <Chatbot />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
