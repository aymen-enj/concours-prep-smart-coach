
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
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-poppins font-bold text-dark-gray mb-8">
            Abonnement et paiement
          </h1>

          <Tabs defaultValue="subscribe" className="mb-8">
            <TabsList>
              <TabsTrigger value="subscribe">S'abonner</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="subscribe" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`${selectedPlan === plan.id ? 'ring-2 ring-royal-blue' : ''} ${plan.popular ? 'relative' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-royal-blue text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                        Populaire
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-500">/{plan.duration}</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${selectedPlan === plan.id ? 'bg-royal-blue' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'Sélectionné' : 'Choisir ce forfait'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card className="mb-8">
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
                    className="w-full bg-royal-blue hover:bg-blue-700"
                  >
                    Payer {plans.find(p => p.id === selectedPlan)?.price}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="pt-6">
              <Card>
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
          <Card className="bg-light-blue">
            <CardHeader>
              <CardTitle>Votre abonnement actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Premium</h3>
                  <p className="text-gray-600">Actif jusqu'au 15 octobre 2023</p>
                </div>
                <Button variant="outline">Gérer l'abonnement</Button>
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
