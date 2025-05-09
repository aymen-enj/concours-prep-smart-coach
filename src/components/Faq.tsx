
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqItems = [
  {
    question: "Comment fonctionne la plateforme Concours Prep ?",
    answer: "Concours Prep est une plateforme qui utilise l'intelligence artificielle pour vous aider à préparer vos concours. Vous pouvez vous entraîner sur des concours des années précédentes et recevoir des corrections personnalisées grâce à notre IA."
  },
  {
    question: "Comment s'inscrire à la plateforme ?",
    answer: "Pour vous inscrire, cliquez sur le bouton 'S'inscrire' en haut à droite de la page d'accueil. Vous pouvez vous inscrire avec votre email ou via Google."
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que le paiement via PayPal. Tous les paiements sont sécurisés."
  },
  {
    question: "Comment fonctionne la correction IA ?",
    answer: "Notre système d'IA analyse vos réponses, les compare aux réponses attendues et vous fournit une correction détaillée avec des explications personnalisées. Elle identifie également vos points faibles pour vous aider à progresser."
  },
  {
    question: "Puis-je accéder à tous les concours avec mon abonnement ?",
    answer: "Oui, votre abonnement vous donne accès à l'ensemble des concours disponibles sur notre plateforme, ainsi qu'aux corrections et aux fonctionnalités d'IA."
  },
  {
    question: "Comment puis-je annuler mon abonnement ?",
    answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord, dans la section 'Mon compte' > 'Abonnement'."
  },
  {
    question: "Les corrections sont-elles disponibles pour tous les concours ?",
    answer: "Oui, tous nos concours sont accompagnés de corrections détaillées et de feedbacks personnalisés générés par notre IA."
  },
  {
    question: "Comment contacter le support si j'ai un problème ?",
    answer: "Vous pouvez nous contacter via le chatbot disponible sur cette page, ou par email à support@concoursprep.com. Nous vous répondrons dans les 24 heures ouvrées."
  }
];

const Faq = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Questions Fréquemment Posées</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="font-medium text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};

export default Faq;
