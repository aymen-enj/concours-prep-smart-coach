
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Veuillez sélectionner un thème.",
  }),
  language: z.enum(["fr", "en"], {
    required_error: "Veuillez sélectionner une langue.",
  }),
});

const AppearanceForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "light",
      language: "fr",
    },
  });

  async function onSubmit(data: z.infer<typeof appearanceFormSchema>) {
    setIsLoading(true);
    try {
      // Here we would save the appearance settings
      // Currently this just shows a success toast
      toast.success("Paramètres d'apparence mis à jour");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thème</FormLabel>
              <div className="flex flex-wrap gap-4">
                <Label
                  htmlFor="light"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:border-primary ${
                    field.value === "light" ? "border-primary" : "border-muted"
                  }`}
                >
                  <div className="mb-3 h-24 w-40 rounded-md bg-[#FFFFFF] border" />
                  <div className="space-y-2">
                    <h3 className="font-medium leading-none">Clair</h3>
                    <p className="text-xs text-muted-foreground">
                      Interface claire pour une utilisation diurne.
                    </p>
                  </div>
                  <Input
                    type="radio"
                    id="light"
                    value="light"
                    className="sr-only"
                    checked={field.value === "light"}
                    onChange={() => field.onChange("light")}
                  />
                </Label>
                <Label
                  htmlFor="dark"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:border-primary ${
                    field.value === "dark" ? "border-primary" : "border-muted"
                  }`}
                >
                  <div className="mb-3 h-24 w-40 rounded-md bg-[#0F172A] border" />
                  <div className="space-y-2">
                    <h3 className="font-medium leading-none">Sombre</h3>
                    <p className="text-xs text-muted-foreground">
                      Interface sombre pour une utilisation nocturne.
                    </p>
                  </div>
                  <Input
                    type="radio"
                    id="dark"
                    value="dark"
                    className="sr-only"
                    checked={field.value === "dark"}
                    onChange={() => field.onChange("dark")}
                  />
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Langue</FormLabel>
              <div className="flex gap-4">
                <Label
                  htmlFor="fr"
                  className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${
                    field.value === "fr" ? "border-primary" : "border-muted"
                  }`}
                >
                  <Input
                    type="radio"
                    id="fr"
                    value="fr"
                    className="sr-only"
                    checked={field.value === "fr"}
                    onChange={() => field.onChange("fr")}
                  />
                  <span>Français</span>
                </Label>
                <Label
                  htmlFor="en"
                  className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${
                    field.value === "en" ? "border-primary" : "border-muted"
                  }`}
                >
                  <Input
                    type="radio"
                    id="en"
                    value="en"
                    className="sr-only"
                    checked={field.value === "en"}
                    onChange={() => field.onChange("en")}
                  />
                  <span>English</span>
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sauvegarder les préférences
        </Button>
      </form>
    </Form>
  );
};

export default AppearanceForm;
