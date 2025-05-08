
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Eye, FilePlus, FileText, Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for concours
const mockConcours = [
  {
    id: "1",
    title: "Concours CNC",
    subject: "Mathématiques",
    year: 2023,
    level: "Préparatoire",
    questions: 5,
    published: true,
  },
  {
    id: "2",
    title: "Concours Médecine",
    subject: "Biologie",
    year: 2023,
    level: "Terminale",
    questions: 12,
    published: true,
  },
  {
    id: "3",
    title: "Concours ENCG",
    subject: "Économie",
    year: 2022,
    level: "Bac+2",
    questions: 8,
    published: false,
  },
  {
    id: "4",
    title: "Concours ENA",
    subject: "Droit Administratif",
    year: 2023,
    level: "Bac+3",
    questions: 15,
    published: false,
  },
];

const Admin = () => {
  const [concoursList, setConcoursList] = useState(mockConcours);
  const [searchTerm, setSearchTerm] = useState("");
  const [newConcours, setNewConcours] = useState({
    title: "",
    subject: "",
    year: new Date().getFullYear().toString(),
    level: "",
    isPremium: false,
  });
  const { toast } = useToast();

  // Filter concours based on search term
  const filteredConcours = concoursList.filter((concours) =>
    concours.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddConcours = () => {
    const id = (concoursList.length + 1).toString();
    const concoursToAdd = {
      id,
      ...newConcours,
      year: parseInt(newConcours.year),
      questions: 0,
      published: false,
    };
    setConcoursList([...concoursList, concoursToAdd]);
    setNewConcours({
      title: "",
      subject: "",
      year: new Date().getFullYear().toString(),
      level: "",
      isPremium: false,
    });
    toast({
      title: "Concours ajouté",
      description: "Le concours a été ajouté avec succès.",
    });
  };

  const handleDeleteConcours = (id: string) => {
    setConcoursList(concoursList.filter((concours) => concours.id !== id));
    toast({
      title: "Concours supprimé",
      description: "Le concours a été supprimé avec succès.",
    });
  };

  const handleTogglePublish = (id: string) => {
    setConcoursList(
      concoursList.map((concours) =>
        concours.id === id
          ? { ...concours, published: !concours.published }
          : concours
      )
    );
    
    const concours = concoursList.find((c) => c.id === id);
    toast({
      title: concours?.published ? "Concours non publié" : "Concours publié",
      description: concours?.published
        ? "Le concours n'est plus visible pour les étudiants."
        : "Le concours est maintenant visible pour les étudiants.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-dark-gray mb-2">
                Panneau d'administration
              </h1>
              <p className="text-gray-600">
                Gérez les concours et les questions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-royal-blue hover:bg-blue-700">
                    <FilePlus className="h-4 w-4 mr-2" /> Ajouter un concours
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau concours</DialogTitle>
                    <DialogDescription>
                      Complétez les détails du concours. Vous pourrez ajouter des questions après la création.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title">Titre du concours</label>
                      <Input
                        id="title"
                        value={newConcours.title}
                        onChange={(e) => setNewConcours({ ...newConcours, title: e.target.value })}
                        placeholder="Ex: Concours CNC"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="subject">Matière</label>
                      <Input
                        id="subject"
                        value={newConcours.subject}
                        onChange={(e) => setNewConcours({ ...newConcours, subject: e.target.value })}
                        placeholder="Ex: Mathématiques"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="year">Année</label>
                        <Input
                          id="year"
                          value={newConcours.year}
                          onChange={(e) => setNewConcours({ ...newConcours, year: e.target.value })}
                          placeholder="Ex: 2023"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="level">Niveau</label>
                        <Input
                          id="level"
                          value={newConcours.level}
                          onChange={(e) => setNewConcours({ ...newConcours, level: e.target.value })}
                          placeholder="Ex: Préparatoire"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isPremium"
                        checked={newConcours.isPremium}
                        onCheckedChange={(checked) =>
                          setNewConcours({ ...newConcours, isPremium: checked as boolean })
                        }
                      />
                      <label htmlFor="isPremium">Contenu premium</label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddConcours}>Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="concours" className="mb-8">
            <TabsList>
              <TabsTrigger value="concours">Concours</TabsTrigger>
              <TabsTrigger value="students">Étudiants</TabsTrigger>
              <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="concours" className="pt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Gestion des concours</CardTitle>
                  <CardDescription>
                    Gérez, modifiez et publiez les concours de la plateforme.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-6">
                    <Input
                      placeholder="Rechercher un concours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Matière</TableHead>
                          <TableHead>Année</TableHead>
                          <TableHead>Niveau</TableHead>
                          <TableHead>Questions</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredConcours.map((concours) => (
                          <TableRow key={concours.id}>
                            <TableCell className="font-medium">
                              {concours.title}
                            </TableCell>
                            <TableCell>{concours.subject}</TableCell>
                            <TableCell>{concours.year}</TableCell>
                            <TableCell>{concours.level}</TableCell>
                            <TableCell>{concours.questions}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  concours.published
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {concours.published ? "Publié" : "Brouillon"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTogglePublish(concours.id)}
                                >
                                  {concours.published ? "Dépublier" : "Publier"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-red-500"
                                  onClick={() => handleDeleteConcours(concours.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader className="pb-3">
                  <CardTitle>Importer un concours</CardTitle>
                  <CardDescription>
                    Importez un concours depuis un fichier PDF ou LaTeX.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
                      <Upload className="h-8 w-8 text-gray-400 mb-4" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-royal-blue hover:text-blue-700"
                        >
                          <span>Importer un fichier</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, LaTeX, ou DOCX jusqu'à 10MB
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Options d'importation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Format de question
                          </label>
                          <Select defaultValue="auto">
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Détection automatique</SelectItem>
                              <SelectItem value="qcm">QCM</SelectItem>
                              <SelectItem value="open">Questions ouvertes</SelectItem>
                              <SelectItem value="mixed">Format mixte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox id="useAI" />
                          <label htmlFor="useAI" className="text-sm font-medium">
                            Utiliser l'IA pour améliorer la détection
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full md:w-auto">
                    Lancer l'importation
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-8">
                <CardHeader className="pb-3">
                  <CardTitle>Éditeur de questions</CardTitle>
                  <CardDescription>
                    Ajoutez ou modifiez des questions pour les concours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <Label htmlFor="concoursSelect">Sélectionner un concours</Label>
                      <Select>
                        <SelectTrigger id="concoursSelect">
                          <SelectValue placeholder="Choisir un concours" />
                        </SelectTrigger>
                        <SelectContent>
                          {concoursList.map((concours) => (
                            <SelectItem key={concours.id} value={concours.id}>
                              {concours.title} ({concours.year})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="questionType">Type de question</Label>
                      <Select defaultValue="qcm">
                        <SelectTrigger id="questionType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="qcm">QCM</SelectItem>
                          <SelectItem value="text">Texte libre</SelectItem>
                          <SelectItem value="latex">Équation (LaTeX)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="questionText">Texte de la question</Label>
                      <Textarea
                        id="questionText"
                        placeholder="Entrez le texte de votre question ici..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Options de réponse (pour QCM)</Label>
                      {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox id={`option-${index}`} />
                          <Input placeholder={`Option ${index}`} className="flex-1" />
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        Ajouter une option
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="correctAnswer">Réponse correcte / Solution</Label>
                      <Textarea
                        id="correctAnswer"
                        placeholder="Entrez la réponse correcte ou la solution détaillée..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Prévisualiser</Button>
                  <Button>Ajouter la question</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des étudiants</CardTitle>
                  <CardDescription>
                    Fonctionnalité à venir dans une prochaine mise à jour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Gestion des étudiants
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      Cette fonctionnalité permettra de gérer les comptes étudiants,
                      suivre leur progression et gérer les abonnements.
                    </p>
                    <Button variant="outline">Notifier lors de la disponibilité</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de la plateforme</CardTitle>
                  <CardDescription>
                    Fonctionnalité à venir dans une prochaine mise à jour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Statistiques et analytiques
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      Cette fonctionnalité affichera des graphiques détaillés sur
                      l'utilisation de la plateforme, les performances des étudiants
                      et les concours les plus populaires.
                    </p>
                    <Button variant="outline">Notifier lors de la disponibilité</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper component for the admin page
const Label = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-gray-700 block mb-1"
    >
      {children}
    </label>
  );
};

export default Admin;
