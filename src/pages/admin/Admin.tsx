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
import { Eye, FilePlus, FileText, Upload, X, Settings, Users, BarChart2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="page-header mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="page-title">
                Panneau d'administration
                <div className="page-title-underline"></div>
              </h1>
            </div>
            <p className="page-description">
              Gérez les concours, les étudiants et les statistiques de la plateforme
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Gestion des concours</h2>
                <p className="text-muted-foreground">Ajoutez et gérez les concours disponibles</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
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
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">Titre du concours</label>
                      <Input
                        id="title"
                        value={newConcours.title}
                        onChange={(e) => setNewConcours({ ...newConcours, title: e.target.value })}
                        placeholder="Ex: Concours CNC"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">Matière</label>
                      <Input
                        id="subject"
                        value={newConcours.subject}
                        onChange={(e) => setNewConcours({ ...newConcours, subject: e.target.value })}
                        placeholder="Ex: Mathématiques"
                        className="form-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="year" className="form-label">Année</label>
                        <Input
                          id="year"
                          value={newConcours.year}
                          onChange={(e) => setNewConcours({ ...newConcours, year: e.target.value })}
                          placeholder="Ex: 2023"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="level" className="form-label">Niveau</label>
                        <Input
                          id="level"
                          value={newConcours.level}
                          onChange={(e) => setNewConcours({ ...newConcours, level: e.target.value })}
                          placeholder="Ex: Préparatoire"
                          className="form-input"
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
                      <label htmlFor="isPremium" className="form-label">Contenu premium</label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddConcours} className="btn-primary">Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="concours" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-xl">
              <TabsTrigger value="concours" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Concours</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Étudiants</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Statistiques</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="concours" className="pt-6">
              <Card className="content-card">
                <CardHeader className="content-card-header">
                  <CardTitle className="content-card-title">
                    <FileText className="h-5 w-5 text-primary" />
                    Gestion des concours
                  </CardTitle>
                  <CardDescription>
                    Gérez, modifiez et publiez les concours de la plateforme.
                  </CardDescription>
                </CardHeader>
                <CardContent className="content-card-body">
                  <div className="flex mb-6">
                    <Input
                      placeholder="Rechercher un concours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm form-input"
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
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                  concours.published
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200"
                                )}
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
                                  className="hover:bg-primary/5"
                                >
                                  {concours.published ? "Dépublier" : "Publier"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-primary/5"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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

              <Card className="content-card mt-8">
                <CardHeader className="content-card-header">
                  <CardTitle className="content-card-title">
                    <Upload className="h-5 w-5 text-primary" />
                    Importer un concours
                  </CardTitle>
                  <CardDescription>
                    Importez un concours depuis un fichier PDF ou LaTeX.
                  </CardDescription>
                </CardHeader>
                <CardContent className="content-card-body">
                  <div className="grid gap-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 hover:border-primary/50 transition-colors duration-200">
                      <Upload className="h-8 w-8 text-gray-400 mb-4" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, LaTeX, ou DOCX jusqu'à 10MB
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Options d'importation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Format de question</label>
                          <Select defaultValue="auto">
                            <SelectTrigger className="form-input">
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
                          <label htmlFor="useAI" className="form-label">
                            Utiliser l'IA pour améliorer la détection
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="btn-primary w-full md:w-auto">
                    Lancer l'importation
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="pt-6">
              <Card className="content-card">
                <CardHeader className="content-card-header">
                  <CardTitle className="content-card-title">
                    <Users className="h-5 w-5 text-primary" />
                    Gestion des étudiants
                  </CardTitle>
                  <CardDescription>
                    Fonctionnalité à venir dans une prochaine mise à jour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="content-card-body">
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Users className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Gestion des étudiants
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Cette fonctionnalité permettra de gérer les comptes étudiants,
                      suivre leur progression et gérer les abonnements.
                    </p>
                    <Button variant="outline">Notifier lors de la disponibilité</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="pt-6">
              <Card className="content-card">
                <CardHeader className="content-card-header">
                  <CardTitle className="content-card-title">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Statistiques de la plateforme
                  </CardTitle>
                  <CardDescription>
                    Fonctionnalité à venir dans une prochaine mise à jour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="content-card-body">
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <BarChart2 className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Statistiques et analytiques
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
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

export default Admin;
