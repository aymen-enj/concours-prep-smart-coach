import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ModernTabsList } from "@/components/ui/ModernTabsList";
import { Badge } from "@/components/ui/badge";

// Mock subscription plans
const plans = [
  {
    id: "basic",
    name: "Essentiel",
    price: "99 DH",
    duration: "1 mois",
    features: [
      "Accès à 10 concours",
      "Corrections IA basiques",
      "Statistiques de progression",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "249 DH",
    duration: "3 mois",
    popular: true,
    features: [
      "Accès à tous les concours",
      "Corrections IA avancées",
      "Statistiques détaillées",
      "Recommandations personnalisées",
      "Accès aux fiches de révision",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "399 DH",
    duration: "6 mois",
    features: [
      "Accès à tous les concours",
      "Corrections IA premium",
      "Statistiques détaillées",
      "Recommandations personnalisées",
      "Accès aux fiches de révision",
      "Sessions de coaching live",
      "Garantie de remboursement",
    ],
  },
];

// Mock payment history
const paymentHistory = [
  {
    id: "INV-001",
    date: "15/04/2023",
    amount: "249 DH",
    status: "Payé",
    plan: "Premium",
  },
  {
    id: "INV-002",
    date: "15/07/2023",
    amount: "249 DH",
    status: "Payé",
    plan: "Premium",
  },
];

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = () => {
    // In a real app, this would process the payment
    console.log("Processing payment for plan:", selectedPlan);
    toast({
      title: "Paiement réussi",
      description: "Votre abonnement a été activé avec succès.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative bg-background">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-1/4 h-64 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-tr-full -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-poppins font-bold text-foreground">
                Abonnement et paiement
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Gérez votre abonnement, consultez l'historique de paiement et choisissez votre forfait.
            </p>
          </div>

          <Tabs defaultValue="subscribe" className="mb-8">
            <ModernTabsList tabs={[
              { value: "subscribe", label: "S'abonner" },
              { value: "history", label: "Historique" }
            ]} />

            <TabsContent value="subscribe" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan, idx) => {
                  const isMiddle = idx === 1;
                  return (
                    <Card
                      key={plan.id}
                      className={`relative group overflow-hidden transition-all duration-200
                        rounded-2xl border border-border/40 bg-card/95 shadow-lg
                        ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}
                        flex flex-col justify-between min-h-[340px] p-0
                      `}
                    >
                      {plan.popular && (
                        <Badge
                          variant="outline"
                          className={`absolute top-4 right-4 gap-1 px-3 py-1 rounded-full font-medium text-xs border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/40 z-10`}
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17.75L18.1878 21l-1.6346-7.0078L22 9.75l-7.19-.6172L12 3 9.19 9.1328 2 9.75l5.4468 4.2422L5.8122 21z" /></svg>
                          Populaire
                        </Badge>
                      )}
                      <CardHeader className="pb-1 pt-6 px-6">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">{plan.name}</CardTitle>
                        <CardDescription className="text-sm opacity-80">{plan.duration}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 px-6">
                        <div className="mb-4 mt-1 text-foreground"> 
                          <span className="font-bold text-xl">{plan.price}</span>
                          <span className="text-muted-foreground text-sm">/{plan.duration}</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 px-1">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-4">
                        <Button
                          className={`w-full rounded-full font-medium text-sm py-2 transition-all
                            ${selectedPlan === plan.id ? 'bg-primary text-white' : 'bg-background border border-border text-primary hover:bg-primary/10'}
                          `}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {selectedPlan === plan.id ? 'Sélectionné' : 'Choisir ce forfait'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden mb-8">
                <CardHeader>
                  <CardTitle>Informations de paiement</CardTitle>
                  <CardDescription>
                    Choisissez votre méthode de paiement préférée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Carte bancaire
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input id="cardName" placeholder="Nom complet" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Date d'expiration</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handlePayment} 
                    className="w-full bg-primary hover:bg-blue-700 rounded-full"
                  >
                    Payer {plans.find(p => p.id === selectedPlan)?.price}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="pt-6">
              <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle>Historique des paiements</CardTitle>
                  <CardDescription>
                    Vos transactions précédentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4">
                        <div className="font-medium">Facture</div>
                        <div className="font-medium">Date</div>
                        <div className="font-medium">Montant</div>
                        <div className="font-medium">Statut</div>
                      </div>
                      <Separator />
                      {paymentHistory.map((payment) => (
                        <div key={payment.id}>
                          <div className="grid grid-cols-4 gap-4 p-4">
                            <div>{payment.id}</div>
                            <div>{payment.date}</div>
                            <div>{payment.amount}</div>
                            <div>
                              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                                {payment.status}
                              </span>
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucun historique de paiement disponible.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Subscription info */}
          <Card className="border border-border/40 bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader>
              <CardTitle>Votre abonnement actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Premium</h3>
                  <p className="text-muted-foreground">Actif jusqu'au 15 octobre 2023</p>
                </div>
                <Button variant="outline" className="rounded-full">Gérer l'abonnement</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;