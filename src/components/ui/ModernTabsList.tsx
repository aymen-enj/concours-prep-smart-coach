import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  value: string;
  label: string;
}

interface ModernTabsListProps {
  tabs: Tab[];
}

export function ModernTabsList({ tabs }: ModernTabsListProps) {
  return (
    <TabsList className="flex w-full justify-center bg-background border border-border/40 rounded-xl p-1 mb-8 shadow-sm">
      {tabs.map(tab => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="flex-1 px-6 py-2 rounded-lg transition-all font-medium
            data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary
            data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}